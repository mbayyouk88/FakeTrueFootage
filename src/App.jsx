// ─── UAD 3.6 Dynamic URAR – True Footage Embedded Report ───────────────────
// All 29 URAR sections; conditional sections appear based on property data.

export default App;

const SECTIONS = [
  { id: 'summary',        label: 'Summary',                     mandatory: true  },
  { id: 'assignment',     label: 'Assignment Information',       mandatory: true  },
  { id: 'subject',        label: 'Subject Property',             mandatory: true  },
  { id: 'site',           label: 'Site',                         mandatory: true  },
  { id: 'dwelling_ext',   label: 'Dwelling Exterior',            mandatory: true  },
  { id: 'unit_interior',  label: 'Unit Interior',                mandatory: true  },
  { id: 'quality',        label: 'Overall Quality & Condition',  mandatory: true  },
  { id: 'amenities',      label: 'Subject Property Amenities',   mandatory: false, trigger: 'hasAmenities'    },
  { id: 'vehicle',        label: 'Vehicle Storage',              mandatory: false, trigger: 'hasVehicle'      },
  { id: 'functional',     label: 'Functional Obsolescence',      mandatory: false, trigger: 'hasFunctional'   },
  { id: 'outbuilding',    label: 'Outbuilding',                  mandatory: false, trigger: 'hasOutbuilding'  },
  { id: 'energy',         label: 'Energy Efficient & Green',     mandatory: false, trigger: 'hasEnergy'       },
  { id: 'project',        label: 'Project Information',          mandatory: false, trigger: 'isCondo'         },
  { id: 'mfg',            label: 'Manufactured Home',            mandatory: false, trigger: 'isMfg'           },
  { id: 'disaster',       label: 'Disaster Mitigation',          mandatory: false, trigger: 'hasDisaster'     },
  { id: 'adu',            label: 'Accessory Dwelling Unit',      mandatory: false, trigger: 'hasADU'          },
  { id: 'listing',        label: 'Subject Listing Information',  mandatory: true  },
  { id: 'prior',          label: 'Prior Sale & Transfer History',mandatory: true  },
  { id: 'market',         label: 'Market Conditions',            mandatory: true  },
  { id: 'hbu',            label: 'Highest & Best Use',           mandatory: true  },
  { id: 'sales_comp',     label: 'Sales Comparison Approach',    mandatory: true  },
  { id: 'cost',           label: 'Cost Approach',                mandatory: false, trigger: 'hasCost'         },
  { id: 'income',         label: 'Income Approach',              mandatory: false, trigger: 'hasIncome'       },
  { id: 'rental',         label: 'Rental Information',           mandatory: false, trigger: 'hasRental'       },
  { id: 'reconciliation', label: 'Reconciliation',               mandatory: true  },
  { id: 'certification',  label: 'Certification & Scope',        mandatory: true  },
];

const FL = ({ label, children, note, conditional }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block' }}>{label}</label>
      {conditional && <span style={{ fontSize: 9, background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>DYNAMIC</span>}
      {note && <span style={{ fontSize: 9, color: '#94a3b8' }}>{note}</span>}
    </div>
    {children}
  </div>
);

const Input = ({ placeholder, value, onChange, type = 'text', width }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: width || '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: '#1e293b', background: 'white', boxSizing: 'border-box' }} />
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={onChange}
    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: '7px 10px', fontSize: 12, color: '#1e293b', background: 'white' }}>
    {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
  </select>
);

const Textarea = ({ placeholder, rows = 3 }) => (
  <textarea placeholder={placeholder} rows={rows}
    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 10px', fontSize: 12, color: '#1e293b', resize: 'vertical', boxSizing: 'border-box' }} />
);

const Row = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>{children}</div>
);

const SectionCard = ({ title, children, badge }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #e2e8f0' }}>
      <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{title}</span>
      {badge && <span style={{ fontSize: 9, background: '#dbeafe', color: '#1d4ed8', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>{badge}</span>}
    </div>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: '#f1f5f9', margin: '14px 0' }} />;

const CheckRow = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#374151', marginBottom: 6 }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: '#2563eb', width: 14, height: 14 }} />
    {label}
  </label>
);

const DynamicBanner = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
    <span style={{ fontSize: 14 }}>⚡</span>
    <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>Dynamic Section — appeared because: <em>{label}</em></span>
  </div>
);

const CompGrid = ({ idx }) => {
  const labels = [
    'Sale Price', 'Sale Date', 'Data Source / Verification',
    'Location', 'Site', 'GLA (sf)', 'Room Count', 'Bedrooms', 'Bathrooms',
    'Basement & Finish', 'Functional Utility', 'Heating / Cooling',
    'Energy Efficient Items', 'Vehicle Storage', 'Porch / Patio / Deck',
    'Fireplace(s)', 'Other Amenities', 'Custom Line 1', 'Custom Line 2', 'Custom Line 3',
  ];
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 12, color: '#2563eb', marginBottom: 8 }}>Comparable {idx + 1}</div>
      <FL label="Address"><Input placeholder="Street, City, State ZIP" /></FL>
      <FL label="Proximity to Subject"><Input placeholder="e.g. 0.32 miles NE" /></FL>
      <FL label="Sale Price / GLA Price"><Row cols={2}><Input placeholder="$000,000" /><Input placeholder="$/sf" /></Row></FL>
      <FL label="Proximity / Data / Verification Source"><Row cols={2}><Input placeholder="MLS #" /><Input placeholder="DOM" /></Row></FL>
      {labels.map(l => (
        <div key={l} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 6, marginBottom: 6, alignItems: 'center' }}>
          <Input placeholder={l} />
          <Input placeholder="Adj $" />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '8px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, marginTop: 8 }}>
        <span>Net Adj / Gross Adj</span>
        <span style={{ color: '#2563eb' }}>+$0 / $0</span>
      </div>
      <FL label="Adjusted Sale Price"><Input placeholder="$000,000" /></FL>
    </div>
  );
};

function App() {
  const [activeSection, setActiveSection] = React.useState('summary');
  const [navOpen, setNavOpen] = React.useState(true);

  // Conditional triggers
  const [propType,       setPropType]       = React.useState('Single Family');
  const [constrMethod,   setConstrMethod]   = React.useState('Site Built');
  const [hasADU,         setHasADU]         = React.useState(false);
  const [hasOutbuilding, setHasOutbuilding] = React.useState(false);
  const [hasEnergy,      setHasEnergy]      = React.useState(false);
  const [hasFunctional,  setHasFunctional]  = React.useState(false);
  const [hasVehicle,     setHasVehicle]     = React.useState(true);
  const [hasAmenities,   setHasAmenities]   = React.useState(true);
  const [hasCost,        setHasCost]        = React.useState(false);
  const [hasIncome,      setHasIncome]      = React.useState(false);
  const [hasRental,      setHasRental]      = React.useState(false);
  const [hasDisaster,    setHasDisaster]    = React.useState(false);

  // Quality/Condition
  const [extQ, setExtQ] = React.useState('Q4');
  const [intQ, setIntQ] = React.useState('Q4');
  const [ovQ,  setOvQ]  = React.useState('Q4');
  const [extC, setExtC] = React.useState('C3');
  const [intC, setIntC] = React.useState('C3');
  const [ovC,  setOvC]  = React.useState('C3');
  const [updateLevel, setUpdateLevel] = React.useState('Updated');

  const [savedToast, setSavedToast] = React.useState(false);

  const isCondo = propType === 'Condominium';
  const isMfg   = constrMethod === 'Manufactured';

  const triggers = { hasADU, hasOutbuilding, hasEnergy, hasFunctional, hasVehicle, hasAmenities, hasCost, hasIncome, hasRental, hasDisaster, isCondo, isMfg };

  const visibleSections = SECTIONS.filter(s => s.mandatory || triggers[s.trigger]);

  const qOpts = ['Q1','Q2','Q3','Q4','Q5','Q6'].map(v => ({ v, l: `${v} – ${['Highest quality, custom design','Superior craftsmanship, high-grade materials','Improved design, quality materials','Standard quality, average workmanship','Basic finishes, modest construction','Lowest quality, bare essentials'][parseInt(v[1])-1]}` }));
  const cOpts = ['C1','C2','C3','C4','C5','C6'].map(v => ({ v, l: `${v} – ${['New construction, never occupied','No deferred maintenance, minor wear','Well-maintained, limited updating needed','Some deferred maintenance, average wear','Significant deferred maintenance','Substantial damage, deferred maintenance'][parseInt(v[1])-1]}` }));

  const save = () => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2500); };

  // ── SECTION CONTENT ──────────────────────────────────────────────────────
  const renderSection = (id) => {
    switch(id) {

      case 'summary': return (
        <div>
          <SectionCard title="Report Summary" badge="MANDATORY">
            <Row cols={3}>
              <FL label="Report Type"><Select value="Traditional" onChange={()=>{}} options={['Traditional','Hybrid','Desktop']} /></FL>
              <FL label="Form / Report Version"><Input placeholder="Dynamic URAR – UAD 3.6" /></FL>
              <FL label="Effective Date"><Input type="date" placeholder="2026-05-20" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Date of Report"><Input type="date" /></FL>
              <FL label="Report Reference #"><Input placeholder="TF-2240" /></FL>
            </Row>
          </SectionCard>
          <SectionCard title="Appraiser Information">
            <Row cols={2}>
              <FL label="Appraiser Name"><Input placeholder="Full legal name" /></FL>
              <FL label="Co-Appraiser / Trainee"><Input placeholder="If applicable" /></FL>
            </Row>
            <Row cols={3}>
              <FL label="License Type"><Select value="Certified Residential" onChange={()=>{}} options={['Certified General','Certified Residential','Licensed','Trainee']} /></FL>
              <FL label="License Number"><Input placeholder="CR-XXXXXXX" /></FL>
              <FL label="License State"><Input placeholder="TX" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Supervisory Appraiser" note="(if applicable)"><Input placeholder="Name" /></FL>
              <FL label="Supervisor License #"><Input placeholder="CR-XXXXXXX" /></FL>
            </Row>
          </SectionCard>
        </div>
      );

      case 'assignment': return (
        <div>
          <SectionCard title="Assignment Information" badge="MANDATORY">
            <Row cols={2}>
              <FL label="Client Name"><Input placeholder="e.g. Westfield AMC" /></FL>
              <FL label="Lender / Client Address"><Input placeholder="Street, City, State ZIP" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Intended Use"><Select value="Mortgage Finance" onChange={()=>{}} options={['Mortgage Finance','Refinance','HELOC','Estate','Relocation','Other']} /></FL>
              <FL label="Intended Users"><Input placeholder="Lender/client and its successors" /></FL>
            </Row>
            <Divider />
            <Row cols={2}>
              <FL label="Property Rights Appraised">
                <Select value="Fee Simple" onChange={()=>{}} options={['Fee Simple','Leasehold','Other']} />
              </FL>
              <FL label="Valuation Method">
                <Select value={propType === 'Single Family' ? 'Traditional' : 'Traditional'} onChange={()=>{}} options={['Traditional','Hybrid','Desktop']} />
              </FL>
            </Row>
            <Row cols={2}>
              <FL label="Scope of Work"><Select value="Interior & Exterior" onChange={()=>{}} options={['Interior & Exterior','Exterior Only','Desktop – No Inspection']} /></FL>
              <FL label="Extraordinary Assumptions"><Input placeholder="None identified" /></FL>
            </Row>
            <FL label="Hypothetical Conditions"><Textarea placeholder="None" rows={2} /></FL>
            <FL label="Limiting Conditions"><Textarea placeholder="Standard limiting conditions apply per certification…" rows={3} /></FL>
          </SectionCard>
        </div>
      );

      case 'subject': return (
        <div>
          <SectionCard title="Subject Property" badge="MANDATORY">
            <FL label="Property Address (including Unit #)"><Input placeholder="4812 Ridgecrest Blvd, Austin, TX 78745" /></FL>
            <Row cols={2}>
              <FL label="Legal Description"><Input placeholder="Lot 7, Block 3, Ridgecrest Subdivision" /></FL>
              <FL label="Assessor Parcel Number (APN)"><Input placeholder="000-000-000" /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Tax Year"><Input placeholder="2025" /></FL>
              <FL label="R.E. Taxes ($)"><Input placeholder="6,840" /></FL>
              <FL label="Special Assessments"><Input placeholder="None" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Neighborhood Name"><Input placeholder="Ridgecrest Estates" /></FL>
              <FL label="Census Tract"><Input placeholder="48453000100" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Map Reference"><Input placeholder="Grid A-7" /></FL>
              <FL label="County"><Input placeholder="Travis" /></FL>
            </Row>
            <Divider />
            <Row cols={3}>
              <FL label="Occupant">
                <Select value="Owner" onChange={()=>{}} options={['Owner','Tenant','Vacant']} />
              </FL>
              <FL label="HOA">
                <Select value="No" onChange={()=>{}} options={['Yes','No']} />
              </FL>
              <FL label="HOA Fee ($/mo)"><Input placeholder="0" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Property Type">
                <Select value={propType} onChange={e => setPropType(e.target.value)} options={['Single Family','Condominium','Cooperative','2-4 Unit','Manufactured Home']} />
              </FL>
              <FL label="Construction Method">
                <Select value={constrMethod} onChange={e => setConstrMethod(e.target.value)} options={['Site Built','Modular','Manufactured']} />
              </FL>
            </Row>
            <Divider />
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 10, fontSize: 11, color: '#0369a1' }}>
              <strong>Dynamic triggers active:</strong> Selecting "Condominium" shows Project Information section. Selecting "Manufactured" shows Manufactured Home section. Enable the toggles in the left nav to reveal other conditional sections.
            </div>
          </SectionCard>
          <SectionCard title="Contract Information" badge="CONDITIONAL">
            <Row cols={3}>
              <FL label="Contract Date"><Input type="date" /></FL>
              <FL label="Contract Price ($)"><Input placeholder="0" /></FL>
              <FL label="Listing Price ($)"><Input placeholder="0" /></FL>
            </Row>
            <FL label="Financial Assistance / Seller Concessions"><Textarea placeholder="None noted" rows={2} /></FL>
          </SectionCard>
        </div>
      );

      case 'site': return (
        <div>
          <SectionCard title="Site" badge="MANDATORY">
            <Row cols={3}>
              <FL label="Lot Size (sf)"><Input placeholder="7,500" /></FL>
              <FL label="Lot Size (acres)"><Input placeholder="0.17" /></FL>
              <FL label="Shape"><Select value="Rectangular" onChange={()=>{}} options={['Rectangular','Irregular','Triangular','Flag Lot','Other']} /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Topography"><Select value="Level" onChange={()=>{}} options={['Level','Gently Rolling','Steep','Other']} /></FL>
              <FL label="Drainage"><Select value="Adequate" onChange={()=>{}} options={['Adequate','Ponding','Other']} /></FL>
              <FL label="Flood Zone"><Input placeholder="Zone X" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="FIRM Map #"><Input placeholder="48453C0465L" /></FL>
              <FL label="FIRM Map Date"><Input type="date" /></FL>
            </Row>
            <Divider />
            <SectionCard title="Zoning">
              <Row cols={3}>
                <FL label="Zoning Classification"><Input placeholder="SF-2" /></FL>
                <FL label="Zoning Description"><Input placeholder="Single-Family Residential" /></FL>
                <FL label="Legally Conforming">
                  <Select value="Yes" onChange={()=>{}} options={['Yes','Legal Nonconforming (Grandfathered)','No','No Zoning']} />
                </FL>
              </Row>
              <FL label="Zoning Comments"><Textarea placeholder="Property use is consistent with applicable zoning regulations." rows={2} /></FL>
            </SectionCard>
            <Divider />
            <SectionCard title="Utilities">
              {[['Electric','Gas'],['Water','Sanitary Sewer'],['Broadband Internet','Storm Sewer']].map(([a,b]) => (
                <Row key={a} cols={2}>
                  <FL label={a}><Select value="Public" onChange={()=>{}} options={['Public','Community','Private','None']} /></FL>
                  <FL label={b}><Select value="Public" onChange={()=>{}} options={['Public','Community','Private','None','Septic System (Private)']} /></FL>
                </Row>
              ))}
            </SectionCard>
            <Divider />
            <SectionCard title="Street / Access">
              <Row cols={3}>
                <FL label="Street Surface"><Select value="Paved" onChange={()=>{}} options={['Paved','Gravel','Dirt']} /></FL>
                <FL label="Street Type"><Select value="Public" onChange={()=>{}} options={['Public','Private']} /></FL>
                <FL label="Alley"><Select value="None" onChange={()=>{}} options={['None','Paved','Gravel','Dirt']} /></FL>
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Location & Influences">
              <Row cols={3}>
                <FL label="Location Rating"><Select value="N; Res" onChange={()=>{}} options={['N; Res','B; Res','A; Res','B; BsyRd','A; BsyRd','B; Wtr','N; Wtr','A; Ind','B; GlfCse','N; Pstrl']} /></FL>
                <FL label="View Rating"><Select value="N; Res" onChange={()=>{}} options={['N; Res','B; Res','B; Wtr','B; Pstrl','B; GlfCse','A; BsyRd','A; Ind','A; RRtracks','N; Pstrl']} /></FL>
                <FL label="Neighborhood Type"><Select value="Urban" onChange={()=>{}} options={['Urban','Suburban','Rural']} /></FL>
              </Row>
              <FL label="Adverse Site Influences"><Textarea placeholder="None noted. No adverse environmental conditions…" rows={2} /></FL>
              <FL label="Site Defects, Damages & Deficiencies" conditional><Textarea placeholder="Describe any observed site defects…" rows={2} /></FL>
            </SectionCard>
            <Divider />
            <SectionCard title="Site Improvements">
              <FL label="Site Improvements Description"><Textarea placeholder="Driveway, walkway, landscaping, fencing…" rows={2} /></FL>
            </SectionCard>
            <Divider />
            <SectionCard title="Site Valuation">
              <Row cols={2}>
                <FL label="Site Valuation Method"><Select value="Extraction" onChange={()=>{}} options={['Allocation','Extraction','Sales Comparison','Other']} /></FL>
                <FL label="Estimated Site Value ($)"><Input placeholder="75,000" /></FL>
              </Row>
            </SectionCard>
          </SectionCard>
        </div>
      );

      case 'dwelling_ext': return (
        <div>
          <SectionCard title="Dwelling Exterior" badge="MANDATORY">
            <Row cols={3}>
              <FL label="Year Built"><Input placeholder="1998" /></FL>
              <FL label="Effective Age (yrs)"><Input placeholder="15" /></FL>
              <FL label="Remaining Economic Life (yrs)"><Input placeholder="40" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Design / Style"><Input placeholder="Ranch / Contemporary" /></FL>
              <FL label="Attached / Detached"><Select value="Detached" onChange={()=>{}} options={['Detached','Attached','Semi-Detached']} /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Stories"><Input placeholder="1" /></FL>
              <FL label="Levels"><Input placeholder="1" /></FL>
            </Row>
            <Divider />
            <SectionCard title="Construction & Materials">
              <Row cols={2}>
                <FL label="Foundation"><Select value="Slab" onChange={()=>{}} options={['Concrete Slab','Crawl Space','Full Basement','Partial Basement','Piers','Other']} /></FL>
                <FL label="Basement Area (sf)"><Input placeholder="0" /></FL>
              </Row>
              <Row cols={2}>
                <FL label="Exterior Walls"><Input placeholder="Brick Veneer / Frame" /></FL>
                <FL label="Roof Surface"><Input placeholder="Composition Shingle" /></FL>
              </Row>
              <Row cols={2}>
                <FL label="Gutters & Downspouts"><Input placeholder="Aluminum" /></FL>
                <FL label="Window Type"><Input placeholder="Double-Pane / Vinyl" /></FL>
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Exterior Quality & Condition">
              <Row cols={2}>
                <FL label="Exterior Quality Rating">
                  <Select value={extQ} onChange={e => setExtQ(e.target.value)} options={qOpts} />
                </FL>
                <FL label="Exterior Condition Rating">
                  <Select value={extC} onChange={e => setExtC(e.target.value)} options={cOpts} />
                </FL>
              </Row>
              <FL label="Exterior Quality / Condition Comments"><Textarea placeholder="Exterior materials are consistent with the quality rating. No deferred maintenance observed…" rows={3} /></FL>
            </SectionCard>
            <Divider />
            <SectionCard title="Defects, Damages & Deficiencies (Exterior)" badge="CONDITIONAL">
              <FL label="Observed Defects" conditional><Textarea placeholder="Describe any exterior defects observed during inspection…" rows={3} /></FL>
              <Row cols={2}>
                <FL label="Impact on Value"><Select value="None" onChange={()=>{}} options={['None','Adverse','Significant']} /></FL>
                <FL label="Impact on Marketability"><Select value="None" onChange={()=>{}} options={['None','Adverse','Significant']} /></FL>
              </Row>
            </SectionCard>
          </SectionCard>
        </div>
      );

      case 'unit_interior': return (
        <div>
          <SectionCard title="Unit Interior" badge="MANDATORY">
            <SectionCard title="Room Count & GLA">
              <Row cols={4}>
                <FL label="Total Rooms"><Input placeholder="7" /></FL>
                <FL label="Bedrooms"><Input placeholder="3" /></FL>
                <FL label="Full Baths"><Input placeholder="2" /></FL>
                <FL label="Half Baths"><Input placeholder="1" /></FL>
              </Row>
              <Row cols={3}>
                <FL label="Above-Grade GLA (sf)" note="ANSI Z765"><Input placeholder="2,340" /></FL>
                <FL label="Below-Grade Area (sf)"><Input placeholder="0" /></FL>
                <FL label="Below-Grade Finished (sf)"><Input placeholder="0" /></FL>
              </Row>
              <FL label="Level-by-Level Breakdown" conditional note="(ADU / Multi-level)"><Textarea placeholder="Level 1: 1,340 sf · Level 2: 1,000 sf" rows={2} /></FL>
            </SectionCard>
            <Divider />
            <SectionCard title="Finishes & Features">
              <Row cols={2}>
                <FL label="Floors"><Input placeholder="Hardwood, Tile, Carpet" /></FL>
                <FL label="Walls / Trim"><Input placeholder="Painted Drywall / Wood" /></FL>
              </Row>
              <Row cols={2}>
                <FL label="Bath Wainscot"><Input placeholder="Ceramic Tile" /></FL>
                <FL label="Doors"><Input placeholder="Solid Core / Panel" /></FL>
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Mechanical Systems">
              <Row cols={2}>
                <FL label="Heating Type"><Select value="Forced Air" onChange={()=>{}} options={['Forced Air','Radiant','Baseboard','Heat Pump','Wall Unit','None']} /></FL>
                <FL label="Heating Fuel"><Select value="Natural Gas" onChange={()=>{}} options={['Natural Gas','Electric','Oil','Propane','Other']} /></FL>
              </Row>
              <Row cols={2}>
                <FL label="Cooling"><Select value="Central Air" onChange={()=>{}} options={['Central Air','Individual Units','Evaporative','None']} /></FL>
                <FL label="Water Heater"><Select value="Gas Tank" onChange={()=>{}} options={['Gas Tank','Electric Tank','Tankless Gas','Tankless Electric','Solar','Other']} /></FL>
              </Row>
              <Row cols={2}>
                <FL label="Laundry"><Select value="In-Unit" onChange={()=>{}} options={['In-Unit','Shared','None']} /></FL>
                <FL label="Fireplace(s)" note="Count"><Input placeholder="1" /></FL>
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Kitchen Equipment">
              <Row cols={3}>
                {['Refrigerator','Dishwasher','Range/Oven','Microwave','Disposal','Washer/Dryer Hook-up'].map(k => (
                  <CheckRow key={k} label={k} checked={true} onChange={()=>{}} />
                ))}
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Attic">
              <Row cols={3}>
                <FL label="Access"><Select value="Drop Stair" onChange={()=>{}} options={['None','Scuttle','Drop Stair','Stairs','Other']} /></FL>
                <FL label="Finish"><Select value="Unfinished" onChange={()=>{}} options={['Unfinished','Partially Finished','Finished']} /></FL>
                <FL label="Heated / Cooled"><Select value="No" onChange={()=>{}} options={['Yes','No']} /></FL>
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Update Level" badge="UAD 3.6">
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {['Not Updated','Updated','Remodeled'].map(u => (
                  <button key={u} onClick={() => setUpdateLevel(u)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${updateLevel === u ? '#2563eb' : '#e2e8f0'}`, background: updateLevel === u ? '#2563eb' : 'white', color: updateLevel === u ? 'white' : '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {u}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>
                {updateLevel === 'Not Updated' && 'Little or no updating in the prior 15 years. The improvements require considerable updating.'}
                {updateLevel === 'Updated' && 'Some updating of finishes/functional utility in the prior 15 years. Minor cosmetic updates are not considered.'}
                {updateLevel === 'Remodeled' && 'Significant finish and/or functional changes in the prior 15 years that increased functionality and/or livability.'}
              </div>
              <Row cols={2}>
                <FL label="Estimated Year of Update (Kitchen)"><Input placeholder="2019" /></FL>
                <FL label="Estimated Year of Update (Baths)"><Input placeholder="2021" /></FL>
              </Row>
            </SectionCard>
            <Divider />
            <SectionCard title="Interior Quality & Condition">
              <Row cols={2}>
                <FL label="Interior Quality Rating">
                  <Select value={intQ} onChange={e => setIntQ(e.target.value)} options={qOpts} />
                </FL>
                <FL label="Interior Condition Rating">
                  <Select value={intC} onChange={e => setIntC(e.target.value)} options={cOpts} />
                </FL>
              </Row>
              <FL label="Interior Quality / Condition Comments"><Textarea placeholder="Interior finishes are consistent with quality rating. Kitchen and baths have been updated…" rows={3} /></FL>
            </SectionCard>
            <Divider />
            <SectionCard title="Defects, Damages & Deficiencies (Interior)" badge="CONDITIONAL">
              <FL label="Observed Defects" conditional><Textarea placeholder="Describe any interior defects observed during inspection…" rows={3} /></FL>
            </SectionCard>
          </SectionCard>
        </div>
      );

      case 'quality': return (
        <div>
          <SectionCard title="Overall Quality & Condition" badge="MANDATORY">
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 11, color: '#0369a1' }}>
              Overall ratings are <strong>absolute</strong> (not comparative). Exterior Q: <strong>{extQ}</strong> · Interior Q: <strong>{intQ}</strong> · Exterior C: <strong>{extC}</strong> · Interior C: <strong>{intC}</strong>
            </div>
            <Row cols={2}>
              <FL label="Overall Quality Rating (Q1–Q6)">
                <Select value={ovQ} onChange={e => setOvQ(e.target.value)} options={qOpts} />
              </FL>
              <FL label="Overall Condition Rating (C1–C6)">
                <Select value={ovC} onChange={e => setOvC(e.target.value)} options={cOpts} />
              </FL>
            </Row>
            <FL label="Quality Narrative / Support Comments">
              <Textarea placeholder="The overall quality rating of Q4 reflects standard quality construction with average workmanship and materials consistent with…" rows={4} />
            </FL>
            <FL label="Condition Narrative / Support Comments">
              <Textarea placeholder="The overall condition of C3 reflects a well-maintained property with no significant deferred maintenance. The roof, HVAC, and mechanical systems are…" rows={4} />
            </FL>
            <Divider />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, background: '#f8fafc', borderRadius: 10, padding: 14 }}>
              {[['Overall Quality',ovQ,'#2563eb'],['Overall Condition',ovC,'#7c3aed'],['Update Level',updateLevel,'#0891b2']].map(([l,v,c]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{l}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      );

      case 'amenities': return (
        <div>
          <DynamicBanner label="hasAmenities = true" />
          <SectionCard title="Subject Property Amenities" badge="CONDITIONAL">
            <Row cols={2}>
              <FL label="Fireplace(s)"><Row cols={2}><Select value="Yes" onChange={()=>{}} options={['Yes','No']} /><Input placeholder="Count: 1" /></Row></FL>
              <FL label="Pool / Spa"><Select value="None" onChange={()=>{}} options={['None','Pool','Spa','Pool & Spa']} /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Patio / Deck"><Select value="Patio & Deck" onChange={()=>{}} options={['None','Patio','Deck','Patio & Deck','Covered Porch']} /></FL>
              <FL label="Fence"><Select value="Privacy – Wood" onChange={()=>{}} options={['None','Chain Link','Privacy – Wood','Wrought Iron','Other']} /></FL>
            </Row>
            <FL label="Other Amenities Description"><Textarea placeholder="Describe any additional amenities that affect value…" rows={2} /></FL>
          </SectionCard>
        </div>
      );

      case 'vehicle': return (
        <div>
          <DynamicBanner label="hasVehicle = true" />
          <SectionCard title="Vehicle Storage" badge="CONDITIONAL">
            <Row cols={3}>
              <FL label="Type"><Select value="Garage" onChange={()=>{}} options={['Garage','Carport','None','Parking Space']} /></FL>
              <FL label="Attachment"><Select value="Attached" onChange={()=>{}} options={['Attached','Detached','Built-In']} /></FL>
              <FL label="Number of Cars"><Input placeholder="2" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Garage Size (sf)"><Input placeholder="480" /></FL>
              <FL label="Finish"><Select value="Unfinished" onChange={()=>{}} options={['Unfinished','Partially Finished','Finished']} /></FL>
            </Row>
          </SectionCard>
        </div>
      );

      case 'functional': return (
        <div>
          <DynamicBanner label="hasFunctional = true" />
          <SectionCard title="Functional Obsolescence" badge="CONDITIONAL">
            <FL label="Type of Functional Obsolescence">
              <Select value="Curable" onChange={()=>{}} options={['Curable','Incurable','Both']} />
            </FL>
            <FL label="Description"><Textarea placeholder="Describe the functional obsolescence and its impact on value…" rows={3} /></FL>
            <Row cols={2}>
              <FL label="Estimated Cost to Cure ($)"><Input placeholder="0" /></FL>
              <FL label="Value Impact ($)"><Input placeholder="0" /></FL>
            </Row>
          </SectionCard>
        </div>
      );

      case 'outbuilding': return (
        <div>
          <DynamicBanner label="hasOutbuilding = true" />
          <SectionCard title="Outbuilding" badge="CONDITIONAL">
            {[1,2].map(i => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#2563eb', marginBottom: 8 }}>Outbuilding {i}</div>
                <Row cols={3}>
                  <FL label="Type"><Select value="Workshop" onChange={()=>{}} options={['Workshop','Barn','Guest House','Storage','Pool House','Greenhouse','Other']} /></FL>
                  <FL label="Size (sf)"><Input placeholder="400" /></FL>
                  <FL label="Year Built"><Input placeholder="2005" /></FL>
                </Row>
                <Row cols={2}>
                  <FL label="Quality Rating"><Select value="Q4" onChange={()=>{}} options={['Q1','Q2','Q3','Q4','Q5','Q6']} /></FL>
                  <FL label="Condition Rating"><Select value="C3" onChange={()=>{}} options={['C1','C2','C3','C4','C5','C6']} /></FL>
                </Row>
                <FL label="GBA (Gross Building Area)"><Input placeholder="400 sf" /></FL>
              </div>
            ))}
          </SectionCard>
        </div>
      );

      case 'energy': return (
        <div>
          <DynamicBanner label="hasEnergy = true" />
          <SectionCard title="Energy Efficient & Green Features" badge="CONDITIONAL">
            <Row cols={2}>
              {['Solar Panels','Solar Water Heater','Geothermal','Wind Turbine','Battery Storage','EV Charger','Smart Thermostat','Green Certification'].map(f => (
                <CheckRow key={f} label={f} checked={f === 'Solar Panels'} onChange={()=>{}} />
              ))}
            </Row>
            <Divider />
            <Row cols={2}>
              <FL label="Solar Panel Ownership"><Select value="Owned" onChange={()=>{}} options={['Owned','Leased','PPA']} /></FL>
              <FL label="System Size (kW)"><Input placeholder="8.5 kW" /></FL>
            </Row>
            <FL label="Green Certification Type" conditional><Input placeholder="ENERGY STAR, LEED, etc." /></FL>
            <FL label="Energy Features Impact on Value"><Textarea placeholder="The solar PV system is owned and estimated to contribute positively to value. Market reaction…" rows={3} /></FL>
          </SectionCard>
        </div>
      );

      case 'project': return (
        <div>
          <DynamicBanner label="Property Type = Condominium" />
          <SectionCard title="Project Information" badge="CONDITIONAL – CONDO">
            <Row cols={2}>
              <FL label="Project Name"><Input placeholder="Lakefront Condominiums" /></FL>
              <FL label="Project Type"><Select value="Established" onChange={()=>{}} options={['New Construction','Established','Proposed','Under Construction']} /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Total Units in Project"><Input placeholder="120" /></FL>
              <FL label="Total Units Completed"><Input placeholder="120" /></FL>
              <FL label="Total Units Sold/Rented"><Input placeholder="95" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="HOA Monthly Assessment"><Input placeholder="$350" /></FL>
              <FL label="HOA Includes"><Input placeholder="Water, Trash, Exterior Maint." /></FL>
            </Row>
            <FL label="Project Phase"><Input placeholder="Phase 1 of 1" /></FL>
            <FL label="Special Assessments / Litigation"><Textarea placeholder="No pending litigation or special assessments noted…" rows={2} /></FL>
            <Row cols={2}>
              <FL label="Owner-Occupancy %"><Input placeholder="72%" /></FL>
              <FL label="Investor / Non-Owner-Occupied %"><Input placeholder="28%" /></FL>
            </Row>
          </SectionCard>
        </div>
      );

      case 'mfg': return (
        <div>
          <DynamicBanner label="Construction Method = Manufactured" />
          <SectionCard title="Manufactured Home" badge="CONDITIONAL">
            <Row cols={2}>
              <FL label="HUD Label / Certification #"><Input placeholder="HUD-XXXXXX" /></FL>
              <FL label="Data Plate Present"><Select value="Yes" onChange={()=>{}} options={['Yes','No']} /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Manufacturer"><Input placeholder="Clayton Homes" /></FL>
              <FL label="Model"><Input placeholder="Freedom 2860" /></FL>
              <FL label="Model Year"><Input placeholder="2015" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Multi-Wide"><Select value="Double Wide" onChange={()=>{}} options={['Single Wide','Double Wide','Triple Wide']} /></FL>
              <FL label="Foundation Type"><Select value="Permanent" onChange={()=>{}} options={['Permanent','Non-Permanent']} /></FL>
            </Row>
            <FL label="Manufactured Home Comments"><Textarea placeholder="The manufactured home is permanently affixed to the foundation and has been titled as real property…" rows={3} /></FL>
          </SectionCard>
        </div>
      );

      case 'disaster': return (
        <div>
          <DynamicBanner label="hasDisaster = true (Disaster Area Assignment)" />
          <SectionCard title="Disaster Mitigation" badge="CONDITIONAL">
            <Row cols={2}>
              <FL label="Disaster Type"><Select value="Flood" onChange={()=>{}} options={['Flood','Fire','Wind/Hurricane','Earthquake','Other']} /></FL>
              <FL label="Disaster Date"><Input type="date" /></FL>
            </Row>
            <FL label="Property Damage Description"><Textarea placeholder="Describe any disaster-related damage observed…" rows={3} /></FL>
            <Row cols={2}>
              <FL label="Repair / Remediation Status"><Select value="Repaired" onChange={()=>{}} options={['No Damage Observed','Repaired','In Progress','Unrepaired']} /></FL>
              <FL label="Impact on Value"><Select value="None" onChange={()=>{}} options={['None','Minor','Significant']} /></FL>
            </Row>
          </SectionCard>
        </div>
      );

      case 'adu': return (
        <div>
          <DynamicBanner label="hasADU = true" />
          <SectionCard title="Accessory Dwelling Unit (ADU)" badge="CONDITIONAL">
            <Row cols={3}>
              <FL label="ADU Type"><Select value="Attached" onChange={()=>{}} options={['Attached','Detached','Garage Conversion','Basement','JADU']} /></FL>
              <FL label="ADU GLA (sf)"><Input placeholder="620" /></FL>
              <FL label="ADU Bedrooms"><Input placeholder="1" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="ADU Year Built"><Input placeholder="2020" /></FL>
              <FL label="ADU Permitted"><Select value="Yes" onChange={()=>{}} options={['Yes','No','Unknown']} /></FL>
            </Row>
            <Row cols={2}>
              <FL label="ADU Quality Rating"><Select value="Q4" onChange={()=>{}} options={['Q1','Q2','Q3','Q4','Q5','Q6']} /></FL>
              <FL label="ADU Condition Rating"><Select value="C2" onChange={()=>{}} options={['C1','C2','C3','C4','C5','C6']} /></FL>
            </Row>
            <FL label="ADU Rental Income (market)"><Input placeholder="$1,200/mo" /></FL>
            <FL label="ADU Comments"><Textarea placeholder="The ADU is a legally permitted detached unit constructed in 2020. It has a separate entrance and utilities…" rows={3} /></FL>
          </SectionCard>
        </div>
      );

      case 'listing': return (
        <div>
          <SectionCard title="Subject Listing Information" badge="MANDATORY">
            <Row cols={2}>
              <FL label="Currently Listed"><Select value="No" onChange={()=>{}} options={['Yes','No']} /></FL>
              <FL label="MLS # / Data Source"><Input placeholder="MLS-XXXXXXX" /></FL>
            </Row>
            <Row cols={3}>
              <FL label="List Price ($)"><Input placeholder="0" /></FL>
              <FL label="List Date"><Input type="date" /></FL>
              <FL label="Days on Market"><Input placeholder="0" /></FL>
            </Row>
            <FL label="Listing Comments"><Textarea placeholder="The subject is not currently listed for sale…" rows={2} /></FL>
          </SectionCard>
        </div>
      );

      case 'prior': return (
        <div>
          <SectionCard title="Prior Sale & Transfer History" badge="MANDATORY">
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Report all sales/transfers within the prior 3 years for the subject, and 1 year for each comparable.</div>
            {['Prior Sale 1 (Subject)','Prior Sale 2 (Subject)'].map((label, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#374151', marginBottom: 8 }}>{label}</div>
                <Row cols={3}>
                  <FL label="Sale Date"><Input type="date" /></FL>
                  <FL label="Sale Price ($)"><Input placeholder="0" /></FL>
                  <FL label="Data Source"><Input placeholder="County Records / MLS" /></FL>
                </Row>
              </div>
            ))}
            <FL label="Prior Sale Analysis Comments"><Textarea placeholder="The subject's prior sale/transfer history has been reviewed. No arm's-length transfers were found in the prior three years…" rows={3} /></FL>
          </SectionCard>
        </div>
      );

      case 'market': return (
        <div>
          <SectionCard title="Market Conditions" badge="MANDATORY">
            <Row cols={3}>
              <FL label="Neighborhood Type"><Select value="Suburban" onChange={()=>{}} options={['Urban','Suburban','Rural']} /></FL>
              <FL label="Neighborhood Built-Up %"><Select value="75-100%" onChange={()=>{}} options={['Under 25%','25-75%','75-100%']} /></FL>
              <FL label="Growth Rate"><Select value="Stable" onChange={()=>{}} options={['Rapid','Stable','Slow','Declining']} /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Property Values Trend"><Select value="Increasing" onChange={()=>{}} options={['Increasing','Stable','Declining']} /></FL>
              <FL label="Demand / Supply"><Select value="In Balance" onChange={()=>{}} options={['Shortage','In Balance','Oversupply']} /></FL>
              <FL label="Marketing Time"><Select value="Under 3 Months" onChange={()=>{}} options={['Under 3 Months','3-6 Months','Over 6 Months']} /></FL>
            </Row>
            <Divider />
            <Row cols={3}>
              <FL label="1-Unit Housing Price Range (Low)"><Input placeholder="$300,000" /></FL>
              <FL label="1-Unit Housing Price Range (High)"><Input placeholder="$650,000" /></FL>
              <FL label="1-Unit Price Predominant"><Input placeholder="$425,000" /></FL>
            </Row>
            <Row cols={3}>
              <FL label="1-Unit Housing Age Range (yrs)"><Input placeholder="5-35" /></FL>
              <FL label="Present Land Use % 1-Unit"><Input placeholder="85%" /></FL>
              <FL label="Present Land Use % Other"><Input placeholder="15%" /></FL>
            </Row>
            <FL label="Market Analysis Comments"><Textarea placeholder="The subject's neighborhood is a well-established suburban residential area. Market conditions are stable with balanced supply and demand…" rows={4} /></FL>
          </SectionCard>
        </div>
      );

      case 'hbu': return (
        <div>
          <SectionCard title="Highest & Best Use" badge="MANDATORY">
            <Row cols={2}>
              <FL label="As Vacant">
                <Select value="Single-family residential" onChange={()=>{}} options={['Single-family residential','Multi-family residential','Commercial','Industrial','Other']} />
              </FL>
              <FL label="As Improved">
                <Select value="Present use" onChange={()=>{}} options={['Present use','Renovation / Conversion','Demolition & Redevelopment','Other']} />
              </FL>
            </Row>
            <FL label="HBU Comments"><Textarea placeholder="The highest and best use of the site as vacant is for single-family residential development, consistent with surrounding land uses and applicable zoning. The highest and best use as improved is the present use…" rows={4} /></FL>
          </SectionCard>
        </div>
      );

      case 'sales_comp': return (
        <div>
          <SectionCard title="Sales Comparison Approach" badge="MANDATORY">
            <div style={{ fontSize: 11, color: '#64748b', background: '#f0f9ff', borderRadius: 8, padding: 10, marginBottom: 14, border: '1px solid #bae6fd' }}>
              <strong>UAD 3.6 Dynamic Grid:</strong> The comparison grid adapts based on property type. Up to 15 subsections (General Info, Project Info, Site, Water Frontage, Dwelling(s), Quality & Condition, etc.) display when relevant.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[0,1,2].map(i => <CompGrid key={i} idx={i} />)}
            </div>
            <Divider />
            <FL label="Additional Comparables (4–6)" conditional note="(if needed)">
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                + Add Comparable 4 / 5 / 6
              </div>
            </FL>
            <Divider />
            <FL label="Sales Comparison Summary & Reconciliation">
              <Textarea placeholder="The three comparable sales selected are the most recent and similar properties available in the subject's market area. Adjustments have been made for differences in…" rows={5} />
            </FL>
            <Row cols={2}>
              <FL label="Indicated Value by Sales Comparison ($)"><Input placeholder="$425,000" /></FL>
              <FL label="Final Adjusted Range"><Input placeholder="$415,000 – $435,000" /></FL>
            </Row>
          </SectionCard>
        </div>
      );

      case 'cost': return (
        <div>
          <DynamicBanner label="hasCost = true" />
          <SectionCard title="Cost Approach" badge="CONDITIONAL">
            <Row cols={2}>
              <FL label="Source of Cost Data"><Input placeholder="Marshall & Swift / Local Cost Service" /></FL>
              <FL label="Quality Rating for Cost"><Select value="Q4" onChange={()=>{}} options={['Q1','Q2','Q3','Q4','Q5','Q6']} /></FL>
            </Row>
            <Divider />
            <FL label="Estimated Site Value ($)"><Input placeholder="75,000" /></FL>
            <Row cols={2}>
              <FL label="Dwelling – Reproduction / Replacement Cost New ($)"><Input placeholder="280,000" /></FL>
              <FL label="Dwelling – Sq Ft × Cost/sf"><Row cols={2}><Input placeholder="2,340 sf" /><Input placeholder="× $120/sf" /></Row></FL>
            </Row>
            <Row cols={3}>
              <FL label="Dwellings – Other ($)"><Input placeholder="0" /></FL>
              <FL label="Garage / Carport ($)"><Input placeholder="12,000" /></FL>
              <FL label="Other Improvements ($)"><Input placeholder="5,000" /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Total Estimated Cost New ($)"><Input placeholder="297,000" /></FL>
              <FL label="Less Physical Depreciation ($)"><Input placeholder="(44,550)" /></FL>
              <FL label="Less Functional Depreciation ($)" conditional><Input placeholder="0" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Less External Depreciation ($)" conditional><Input placeholder="0" /></FL>
              <FL label="Depreciated Value of Improvements ($)"><Input placeholder="252,450" /></FL>
            </Row>
            <FL label="Indicated Value by Cost Approach ($)">
              <Input placeholder="$327,450" />
            </FL>
            <FL label="Cost Approach Comments"><Textarea placeholder="The cost approach has been developed to support the sales comparison approach. Depreciation was estimated using the age-life method…" rows={3} /></FL>
          </SectionCard>
        </div>
      );

      case 'income': return (
        <div>
          <DynamicBanner label="hasIncome = true" />
          <SectionCard title="Income Approach" badge="CONDITIONAL">
            <Row cols={3}>
              <FL label="Estimated Monthly Market Rent ($)"><Input placeholder="2,400" /></FL>
              <FL label="× Gross Rent Multiplier (GRM)"><Input placeholder="175" /></FL>
              <FL label="= Indicated Value ($)"><Input placeholder="$420,000" /></FL>
            </Row>
            <FL label="Rental Survey / Comparable Rentals">
              <Textarea placeholder="Three comparable rentals were analyzed ranging from $2,200 to $2,600/month. The subject's market rent is estimated at $2,400/month…" rows={3} />
            </FL>
          </SectionCard>
        </div>
      );

      case 'rental': return (
        <div>
          <DynamicBanner label="hasRental = true" />
          <SectionCard title="Rental Information" badge="CONDITIONAL">
            <Row cols={2}>
              <FL label="Current Rent ($)"><Input placeholder="2,200" /></FL>
              <FL label="Lease Expiration"><Input type="date" /></FL>
            </Row>
            <FL label="Rental Comments"><Textarea placeholder="The subject is currently tenant-occupied under a month-to-month lease…" rows={2} /></FL>
          </SectionCard>
        </div>
      );

      case 'reconciliation': return (
        <div>
          <SectionCard title="Reconciliation" badge="MANDATORY">
            <Row cols={3}>
              <FL label="Sales Comparison Approach ($)"><Input placeholder="$425,000" /></FL>
              <FL label="Cost Approach ($)" note="(if developed)"><Input placeholder="$327,450" /></FL>
              <FL label="Income Approach ($)" note="(if developed)"><Input placeholder="N/A" /></FL>
            </Row>
            <FL label="Final Opinion of Value ($)">
              <input style={{ width: '100%', border: '2px solid #2563eb', borderRadius: 8, padding: '10px 12px', fontSize: 16, fontWeight: 700, color: '#2563eb', background: '#eff6ff', boxSizing: 'border-box' }} placeholder="$425,000" />
            </FL>
            <Row cols={2}>
              <FL label="Effective Date of Appraisal"><Input type="date" /></FL>
              <FL label="Prospective / Retrospective Value"><Select value="Current (As of Effective Date)" onChange={()=>{}} options={['Current (As of Effective Date)','Prospective','Retrospective']} /></FL>
            </Row>
            <FL label="Reconciliation Narrative">
              <Textarea placeholder="The sales comparison approach is given most weight in this analysis as it best reflects the actions of buyers and sellers in this market. The final opinion of value is $425,000, as of the effective date of appraisal…" rows={5} />
            </FL>
            <Divider />
            <SectionCard title="Market Value Definition">
              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.7, background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                The most probable price which a property should bring in a competitive and open market under all conditions requisite to a fair sale, the buyer and seller each acting prudently and knowledgeably, and assuming the price is not affected by undue stimulus.
              </div>
            </SectionCard>
          </SectionCard>
        </div>
      );

      case 'certification': return (
        <div>
          <SectionCard title="Certification & Scope of Work" badge="MANDATORY">
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, fontSize: 11, color: '#166534', lineHeight: 1.8, marginBottom: 16 }}>
              I certify that, to the best of my knowledge and belief:<br/>
              • The statements of fact contained in this report are true and correct.<br/>
              • The reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions, and are my personal, impartial, and unbiased professional analyses, opinions, and conclusions.<br/>
              • I have no present or prospective interest in the property and no personal interest with respect to the parties involved.<br/>
              • I have performed no services, as an appraiser or in any other capacity, regarding the property that is the subject of this report within the three-year period immediately preceding acceptance of this assignment.<br/>
              • My compensation for completing this assignment is not contingent upon the development or reporting of a predetermined value or direction in value that favors the cause of the client.
            </div>
            <Row cols={2}>
              <FL label="Appraiser Signature"><Input placeholder="Digital signature" /></FL>
              <FL label="Date Signed"><Input type="date" /></FL>
            </Row>
            <Row cols={3}>
              <FL label="Appraiser Name (Print)"><Input placeholder="Full name" /></FL>
              <FL label="License #"><Input placeholder="CR-XXXXXXX" /></FL>
              <FL label="License State"><Input placeholder="TX" /></FL>
            </Row>
            <Row cols={2}>
              <FL label="Inspection Date"><Input type="date" /></FL>
              <FL label="Report Date"><Input type="date" /></FL>
            </Row>
            <Divider />
            <SectionCard title="Supervisory Appraiser" badge="CONDITIONAL">
              <Row cols={2}>
                <FL label="Supervisory Appraiser Name" conditional><Input placeholder="If applicable" /></FL>
                <FL label="Supervisory License #" conditional><Input placeholder="CR-XXXXXXX" /></FL>
              </Row>
              <FL label="Supervisory Inspection of Subject Property" conditional>
                <Select value="Interior & Exterior" onChange={()=>{}} options={['Interior & Exterior','Exterior Only','Did Not Inspect']} />
              </FL>
            </SectionCard>
            <Divider />
            <SectionCard title="UCDP Submission">
              <Row cols={2}>
                <FL label="UCDP Doc File ID"><Input placeholder="Pending submission" /></FL>
                <FL label="Submission Status"><Select value="Pending" onChange={()=>{}} options={['Pending','Submitted','Accepted','Revision Required']} /></FL>
              </Row>
            </SectionCard>
          </SectionCard>
        </div>
      );

      default: return <div style={{ color: '#94a3b8', fontSize: 13, padding: 20 }}>Section coming soon.</div>;
    }
  };

  const conditional = [
    { key: 'hasAmenities',   label: 'Subject Amenities',     val: hasAmenities,   set: setHasAmenities   },
    { key: 'hasVehicle',     label: 'Vehicle Storage',       val: hasVehicle,     set: setHasVehicle     },
    { key: 'hasADU',         label: 'ADU Present',           val: hasADU,         set: setHasADU         },
    { key: 'hasOutbuilding', label: 'Outbuilding',           val: hasOutbuilding, set: setHasOutbuilding },
    { key: 'hasEnergy',      label: 'Energy / Green',        val: hasEnergy,      set: setHasEnergy      },
    { key: 'hasFunctional',  label: 'Functional Obsol.',     val: hasFunctional,  set: setHasFunctional  },
    { key: 'hasCost',        label: 'Cost Approach',         val: hasCost,        set: setHasCost        },
    { key: 'hasIncome',      label: 'Income Approach',       val: hasIncome,      set: setHasIncome      },
    { key: 'hasRental',      label: 'Rental Info',           val: hasRental,      set: setHasRental      },
    { key: 'hasDisaster',    label: 'Disaster Mitigation',   val: hasDisaster,    set: setHasDisaster    },
  ];

  const completedCount = visibleSections.length;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, background: '#f8fafc', overflow: 'hidden' }}>

      {/* Toast */}
      {savedToast && (
        <div style={{ position: 'fixed', top: 14, right: 14, zIndex: 999, background: '#16a34a', color: 'white', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          ✓ Section saved to report
        </div>
      )}

      {/* Left Nav */}
      <div style={{ width: navOpen ? 220 : 0, background: '#0f172a', color: 'white', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.2s' }}>
        <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, background: '#3b82f6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>TF</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>True Footage</div>
              <div style={{ fontSize: 9, color: '#64748b' }}>UAD 3.6 Dynamic URAR</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>Sections active: <strong style={{ color: '#60a5fa' }}>{completedCount} / {SECTIONS.length}</strong></div>
          <div style={{ background: '#1e293b', borderRadius: 99, height: 4 }}>
            <div style={{ width: `${(completedCount/SECTIONS.length)*100}%`, height: 4, borderRadius: 99, background: '#3b82f6' }}></div>
          </div>
        </div>

        {/* Dynamic section toggles */}
        <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>⚡ Dynamic Sections</div>
          {conditional.map(c => (
            <label key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 4 }}>
              <input type="checkbox" checked={c.val} onChange={e => c.set(e.target.checked)} style={{ accentColor: '#3b82f6', width: 12, height: 12 }} />
              <span style={{ fontSize: 10, color: c.val ? '#93c5fd' : '#64748b' }}>{c.label}</span>
            </label>
          ))}
          <div style={{ marginTop: 6 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 2 }}>
              <input type="checkbox" checked={isCondo} onChange={e => setPropType(e.target.checked ? 'Condominium' : 'Single Family')} style={{ accentColor: '#3b82f6', width: 12, height: 12 }} />
              <span style={{ fontSize: 10, color: isCondo ? '#93c5fd' : '#64748b' }}>Condo (Project Info)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={isMfg} onChange={e => setConstrMethod(e.target.checked ? 'Manufactured' : 'Site Built')} style={{ accentColor: '#3b82f6', width: 12, height: 12 }} />
              <span style={{ fontSize: 10, color: isMfg ? '#93c5fd' : '#64748b' }}>Manufactured Home</span>
            </label>
          </div>
        </div>

        {/* Section list */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
          {visibleSections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 1, background: activeSection === s.id ? '#2563eb' : 'transparent', color: activeSection === s.id ? 'white' : '#94a3b8' }}>
              <span style={{ fontSize: 8, color: s.mandatory ? '#34d399' : '#fbbf24', flexShrink: 0 }}>●</span>
              <span style={{ fontSize: 11, fontWeight: activeSection === s.id ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: 8, borderTop: '1px solid #1e293b', fontSize: 9, color: '#334155', textAlign: 'center' }}>
          <span style={{ color: '#34d399' }}>●</span> Mandatory   <span style={{ color: '#fbbf24' }}>●</span> Conditional
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', fontSize: 12, color: '#475569' }}>☰</button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                {visibleSections.find(s => s.id === activeSection)?.label || 'UAD 3.6 Report'}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                4812 Ridgecrest Blvd, Austin TX 78745 · TF-2240
                {visibleSections.find(s=>s.id===activeSection)?.mandatory === false && <span style={{ marginLeft: 8, background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: 3, fontWeight: 600, fontSize: 9 }}>DYNAMIC SECTION</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '4px 10px', fontSize: 10, color: '#1d4ed8', fontWeight: 600 }}>
              ● UAD 3.6 · {ovQ} / {ovC}
            </div>
            <button onClick={save} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Save Section
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {renderSection(activeSection)}

          {/* Prev / Next */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={() => {
                const idx = visibleSections.findIndex(s => s.id === activeSection);
                if (idx > 0) setActiveSection(visibleSections[idx-1].id);
              }}
              style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
              ← Previous
            </button>
            <button
              onClick={() => {
                const idx = visibleSections.findIndex(s => s.id === activeSection);
                if (idx < visibleSections.length - 1) setActiveSection(visibleSections[idx+1].id);
                else save();
              }}
              style={{ padding: '8px 18px', background: '#2563eb', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {visibleSections.findIndex(s => s.id === activeSection) < visibleSections.length - 1 ? 'Next →' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
