import React, { useEffect, useRef } from 'react';
import * as d3geo from 'd3-geo';
import * as topojson from 'topojson-client';
import './DiasporaMap.css';

// Color interpolation: 0 votes → dark, max votes → cyan #8B5CF6
function voteColor(count, max) {
    if (!count || !max) return '#0d1f2d';
    const t = Math.sqrt(count / max); // sqrt for better visual distribution
    // Interpolate from #0d1f2d to #8B5CF6
    const r = Math.round(13  + (79  - 13)  * t);
    const g = Math.round(31  + (195 - 31)  * t);
    const b = Math.round(45  + (247 - 45)  * t);
    return `rgb(${r},${g},${b})`;
}

export default function DiasporaMap({ geoData = [] }) {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Build vote lookup by ISO2 country code
        const voteByCountry = {};
        let maxVotes = 0;
        for (const row of geoData) {
            const code = (row.country_code || '').toUpperCase();
            voteByCountry[code] = (voteByCountry[code] || 0) + (row.vote_count || 0);
            if (voteByCountry[code] > maxVotes) maxVotes = voteByCountry[code];
        }

        const W = svg.clientWidth || 600;
        const H = Math.round(W * 0.52);
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

        const projection = d3geo.geoNaturalEarth1()
            .scale(W / 6.2)
            .translate([W / 2, H / 2]);

        const path = d3geo.geoPath().projection(projection);

        // Remove old contents
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        // Fetch world topojson (already at public/world-110m.json)
        fetch('/world-110m.json')
            .then(r => r.json())
            .then(world => {
                const countries = topojson.feature(world, world.objects.countries);

                // Build iso numeric → alpha2 mapping is complex; instead, rely on
                // country_code field being ISO3166-1 alpha-2.
                // world-110m uses numeric IDs; we need a lookup.
                // Use a lightweight inline lookup for top diaspora countries.
                const numericToAlpha2 = buildNumericLookup();

                // Tooltip element
                let tooltip = svg.ownerDocument.getElementById('diaspora-tooltip');
                if (!tooltip) {
                    tooltip = svg.ownerDocument.createElement('div');
                    tooltip.id = 'diaspora-tooltip';
                    tooltip.className = 'diaspora-tooltip';
                    svg.parentElement.appendChild(tooltip);
                }

                const g = svg.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'g');

                for (const feature of countries.features) {
                    const alpha2 = numericToAlpha2[String(feature.id)] || '';
                    const votes = voteByCountry[alpha2] || 0;
                    const fill = voteColor(votes, maxVotes);

                    const pathEl = svg.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
                    pathEl.setAttribute('d', path(feature) || '');
                    pathEl.setAttribute('fill', fill);
                    pathEl.setAttribute('stroke', '#0a1929');
                    pathEl.setAttribute('stroke-width', '0.5');
                    pathEl.style.cursor = votes > 0 ? 'pointer' : 'default';

                    if (votes > 0) {
                        pathEl.addEventListener('mouseenter', (e) => {
                            pathEl.setAttribute('fill', '#69d98c');
                            tooltip.textContent = `${alpha2}: ${votes.toLocaleString()} endorsements`;
                            tooltip.style.display = 'block';
                        });
                        pathEl.addEventListener('mousemove', (e) => {
                            const rect = svg.parentElement.getBoundingClientRect();
                            tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
                            tooltip.style.top  = (e.clientY - rect.top  - 28) + 'px';
                        });
                        pathEl.addEventListener('mouseleave', () => {
                            pathEl.setAttribute('fill', fill);
                            tooltip.style.display = 'none';
                        });
                    }

                    g.appendChild(pathEl);
                }
                svg.appendChild(g);
            })
            .catch(() => { /* world-110m not available */ });
    }, [geoData]);

    return (
        <div className="diaspora-map-root">
            <svg ref={svgRef} className="diaspora-map-svg" />
        </div>
    );
}

// Minimal ISO 3166-1 numeric → alpha-2 lookup for common diaspora countries
function buildNumericLookup() {
    return {
        '4':'AF','8':'AL','12':'DZ','36':'AU','40':'AT','50':'BD','56':'BE','76':'BR',
        '100':'BG','124':'CA','156':'CN','170':'CO','191':'HR','196':'CY','203':'CZ',
        '208':'DK','818':'EG','233':'EE','246':'FI','250':'FR','276':'DE','300':'GR',
        '348':'HU','356':'IN','360':'ID','364':'IR','368':'IQ','372':'IE','376':'IL',
        '380':'IT','388':'JM','392':'JP','400':'JO','398':'KZ','404':'KE','414':'KW',
        '422':'LB','440':'LT','442':'LU','458':'MY','484':'MX','504':'MA','528':'NL',
        '554':'NZ','566':'NG','578':'NO','586':'PK','275':'PS','616':'PL','620':'PT',
        '634':'QA','642':'RO','643':'RU','682':'SA','688':'RS','703':'SK','705':'SI',
        '710':'ZA','724':'ES','752':'SE','756':'CH','792':'TR','804':'UA','784':'AE',
        '826':'GB','840':'US','860':'UZ','862':'VE','704':'VN','887':'YE',
    };
}
