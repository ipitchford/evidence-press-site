'use strict';

// Exact diagram for the nonproportional oblique-trigger family in manuscript
// section 12.4. Geometry is schematic, but every displayed threshold and bound
// is the exact value proved in the release.
const colors = ['#67e8f9', '#f6c76e'];
const description = 'A square state space is cut by the exact oblique trigger u plus v equals one. Before v is observed, one early payment must work on both sides. Off trigger, programme service permits a ceiling of 25. On trigger at uplift lambda equals 20, duration binds at 110 over 7. The family changes binding constraint at lambda equals 75 over 7. The diagram is an explanatory map of the exact construction, not sovereign data.';

function draw(a = colors[0], b = colors[1]) {
  return `<g font-family="Arial,Helvetica,sans-serif">
    <g transform="translate(54 48)">
      <rect x="0" y="0" width="304" height="304" rx="18" fill="#fff" fill-opacity=".035" stroke="#f7efe5" stroke-opacity=".28" stroke-width="2"/>
      <path d="M0 304 L304 0 L304 304 Z" fill="${b}" fill-opacity=".13"/>
      <path d="M0 304 L304 0" fill="none" stroke="${b}" stroke-width="5" stroke-linecap="round"/>
      <path d="M152 0 V304" fill="none" stroke="${a}" stroke-width="2.5" stroke-dasharray="7 8" opacity=".75"/>
      <circle cx="152" cy="152" r="8" fill="${a}"/>
      <circle cx="152" cy="152" r="19" fill="none" stroke="${a}" stroke-opacity=".34" stroke-width="2"/>
      <g class="og-hide" fill="#fff7ed" font-size="20">
        <text x="8" y="326">u = 0</text><text x="266" y="326">u = 1</text>
        <text x="8" y="26">v = 1</text><text x="8" y="294">v = 0</text>
      </g>
      <g class="og-hide" text-anchor="middle">
        <text x="88" y="84" fill="${a}" font-size="23">trigger off</text>
        <text x="224" y="242" fill="${b}" font-size="23">trigger on</text>
        <text x="152" y="28" fill="#f7efe5" font-size="18">one p before v is known</text>
      </g>
    </g>

    <path d="M390 200 H475" stroke="#f7efe5" stroke-opacity=".55" stroke-width="2.5"/>
    <path d="M458 190 L475 200 L458 210" fill="none" stroke="#f7efe5" stroke-opacity=".55" stroke-width="2.5"/>

    <g transform="translate(505 48)">
      <rect x="0" y="0" width="302" height="304" rx="18" fill="#fff" fill-opacity=".04" stroke="${a}" stroke-opacity=".45" stroke-width="2"/>
      <text class="og-hide" x="151" y="42" text-anchor="middle" fill="#fff7ed" font-size="21">statewise ceilings</text>
      <text x="151" y="108" text-anchor="middle" fill="${a}" font-family="Georgia,serif" font-size="48">p ≤ 25</text>
      <text class="og-hide" x="151" y="140" text-anchor="middle" fill="#cdd8d2" font-size="17">off trigger · programme service binds</text>
      <line x1="35" y1="166" x2="267" y2="166" stroke="#fff" stroke-opacity=".18"/>
      <text x="151" y="232" text-anchor="middle" fill="${b}" font-family="Georgia,serif" font-size="48">p ≤ 110/7</text>
      <text class="og-hide" x="151" y="264" text-anchor="middle" fill="#cdd8d2" font-size="17">on trigger · duration binds</text>
      <text class="og-hide" x="151" y="292" text-anchor="middle" fill="#cdd8d2" font-size="15">λ = 20</text>
    </g>

    <path d="M833 200 H895" stroke="#f7efe5" stroke-opacity=".55" stroke-width="2.5"/>
    <path d="M878 190 L895 200 L878 210" fill="none" stroke="#f7efe5" stroke-opacity=".55" stroke-width="2.5"/>

    <g transform="translate(920 48)">
      <rect x="0" y="0" width="226" height="304" rx="18" fill="#fff" fill-opacity=".04" stroke="${b}" stroke-opacity=".5" stroke-width="2"/>
      <text class="og-hide" x="113" y="43" text-anchor="middle" fill="#fff7ed" font-size="20">binding switch</text>
      <text x="113" y="114" text-anchor="middle" fill="${b}" font-family="Georgia,serif" font-size="39">λ = 75/7</text>
      <path d="M38 161 H188" stroke="#f7efe5" stroke-opacity=".28" stroke-width="2"/>
      <circle cx="113" cy="161" r="8" fill="#fff7ed"/>
      <path d="M38 161 H113" stroke="${a}" stroke-width="5"/><path d="M113 161 H188" stroke="${b}" stroke-width="5"/>
      <text class="og-hide" x="72" y="205" text-anchor="middle" fill="${a}" font-size="16">programme</text>
      <text class="og-hide" x="157" y="205" text-anchor="middle" fill="${b}" font-size="16">duration</text>
      <text class="og-hide" x="113" y="263" text-anchor="middle" fill="#fff7ed" font-family="Georgia,serif" font-size="25">one robust cap</text>
      <text class="og-hide" x="113" y="289" text-anchor="middle" fill="#cdd8d2" font-size="14">unmatched old claims</text>
    </g>
  </g>`;
}

function thumbnailHero() {
  return '<div class="eq-label">oblique-trigger robust ceiling</div><div style="font-family:Georgia,serif;font-size:82px;text-align:center;margin:18px 0"><span>25</span> <span class="hl">→</span> <span>110/7</span></div><div class="note">Programme service binds first.<br><b>Duration binds after the trigger.</b></div><div class="eq-foot">exact switch at λ = 75/7</div>';
}

module.exports = { colors, description, draw, thumbnailHero };
