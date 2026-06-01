import React, { useState, useEffect, useRef } from 'react';


// ─── UAD 3.6 Dynamic URAR – True Footage Embedded Report ───────────────────
// All 29 URAR sections; conditional sections appear based on property data.

export default App;

// ── Shared UI primitives ──────────────────────────────────────────────────────
const Input = ({ val, onChange, placeholder, type = 'text', cls = '' }) => (
  <input type={type} placeholder={placeholder}
    className={`w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 ${cls}`}
    value={val || ''} onChange={e => onChange(e.target.value)} />
);

const Sel = ({ val, onChange, opts, placeholder }) => (
  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
    value={val || ''} onChange={e => onChange(e.target.value)}>
    {placeholder && <option value="">{placeholder}</option>}
    {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
  </select>
);

const Textarea = ({ val, onChange, rows = 3, placeholder }) => (
  <textarea rows={rows} placeholder={placeholder}
    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
    value={val || ''} onChange={e => onChange(e.target.value)} />
);

const Toggle = ({ on, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div onClick={() => onChange(!on)}
      className={`w-10 h-5 rounded-full relative transition-colors ${on ? 'bg-blue-600' : 'bg-gray-300'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const F = ({ label, req, hint, children }) => (
  <div className="mb-3">
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {label}{req && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-amber-600 mt-0.5">⚡ {hint}</p>}
  </div>
);

const G2 = ({ children }) => <div className="grid grid-cols-2 gap-3">{children}</div>;
const G3 = ({ children }) => <div className="grid grid-cols-3 gap-3">{children}</div>;

const Tag = ({ color, children }) => {
  const c = color === 'green' ? 'bg-green-100 text-green-700' :
            color === 'amber' ? 'bg-amber-100 text-amber-700' :
            color === 'red'   ? 'bg-red-100 text-red-700'     : 'bg-blue-100 text-blue-700';
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c}`}>{children}</span>;
};

const SectionHeader = ({ num, title, mandatory, badge }) => (
  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
    <span className="text-xs font-mono bg-gray-800 text-white px-2 py-0.5 rounded">{num}</span>
    <h2 className="text-base font-bold text-gray-800 flex-1">{title}</h2>
    {mandatory ? <Tag color="green">Mandatory</Tag> : <Tag color="amber">Conditional</Tag>}
    {badge && <Tag color="blue">{badge}</Tag>}
  </div>
);

const ConditionalBanner = ({ text }) => (
  <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-4 text-xs text-amber-700 flex items-center gap-2">
    <span>⚡</span> {text}
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [f, setF] = useState({
    // Assignment-level triggers
    propertyType: 'SFR',
    assignmentType: 'Refinance',
    valuationMethod: 'Traditional',

    // Subject
    address: '', city: '', state: '', zip: '', county: '',
    legalDesc: '', apn: '', taxYear: '', reTaxes: '', specialAssess: '',
    occupancy: 'Owner',

    // Site
    siteArea: '', siteUnit: 'sq ft', siteShape: '', zoning: '', zoningDesc: '',
    zoningCompliance: 'Legal', utilities: '', streetType: 'Public',
    streetSurface: 'Paved', alley: 'None',
    hasWaterFrontage: false, waterFrontageType: '', waterFrontagePrivate: false,
    siteTopography: '', siteSize: '', siteInfluences: '',

    // Dwelling Exterior
    yearBuilt: '', effectiveAge: '', stories: '',
    designStyle: '', foundationType: '', exteriorWalls: '',
    roofSurface: '', roofType: '', gutters: false,
    windowType: '', stormSash: false, screens: false,
    manufacturingMethod: 'Site-Built',

    // Unit Interior
    floors: '', walls: '', trimFinish: '',
    bathWainscot: '', bathFloor: '',
    heatingType: '', heatingFuel: '', coolingType: '',
    amenitiesFireplace: '', amenitiesFireplaceCount: '',
    gla: '', glaBelowGrade: '', belowGradeFinished: '',
    bedrooms: '', bathrooms: '', halfBaths: '',

    // Quality & Condition
    qualityRating: '',
    conditionRating: '',
    defects: '', physicalDeficiencies: '', adverseEnvConditions: '',
    kitchenUpdate: '', bathUpdate: '', otherUpdate: '', updateTimeframe: '',

    // View
    viewRating: '', viewFactors: [],

    // Vehicle Storage
    vehicleStorage: 'None', vehicleSpaces: '', vehicleSize: '',
    vehicleCarport: false, vehicleAttached: false,

    // Amenities
    pool: false, spa: false, fence: false, patio: false, deck: false,
    porch: false, shed: false,

    // Conditional sections
    hasOutbuilding: false,
    outbuildingType: '', outbuildingSize: '', outbuildingCondition: '',

    hasFunctionalObsolescence: false,
    functionalObsDesc: '',

    hasEnergyFeatures: false,
    energySolar: false, energyGeothermal: false, energyWindTurbine: false,
    energyOther: '', greenCertification: '',

    isIncomeProducing: false,
    monthlyRent: '', rentBasis: '', rentVacancy: '',

    isDisasterArea: false, disasterType: '', disasterDesc: '',

    showCostApproach: false,
    siteValue: '', dwellingValue: '', depreciationAmt: '', depreciationPct: '',
    improvementsAsIs: '', costAsIs: '',

    hasADU: false,
    aduType: '', aduGLA: '', aduBed: '', aduBath: '', aduRent: '',

    hasProjectInfo: false, // driven by Condo
    projectName: '', projectType: '', projectUnits: '', projectPhase: '',
    hoaDues: '', hoaDuesFreq: '', hoaFeeIncludes: '',

    // HBU
    hbuVacant: '', hbuImproved: '',

    // Market
    neighborhoodBoundaries: '', neighborhoodDesc: '',
    landUse1Unit: '', landUse24Unit: '', landUseCommercial: '', landUseOther: '',
    propertyValues: '', demandSupply: '', marketingTime: '',
    priceRangeLow: '', priceRangeHigh: '', priceRangePred: '',
    ageLow: '', ageHigh: '', agePred: '',

    // Listing
    priorListings: 'None', listingDate: '', listingPrice: '', listingDays: '',

    // Prior Sale
    priorSale12: 'No', priorSale12Date: '', priorSale12Price: '',
    priorSale36: 'No', priorSale36Date: '', priorSale36Price: '',

    // Sales Contract
    contractDate: '', contractPrice: '', concessions: '',
    concessionType: '', financingType: '',

    // Sales Comparison (3 comps)
    comps: [
      { address: '', prox: '', salePrice: '', salePriceGLA: '', dataSource: '', verSource: '',
        saleDate: '', saleType: '', concessions: '', location: '', site: '', view: '',
        designStyle: '', quality: '', age: '', condition: '', aboveGrade: '', gla: '',
        basement: '', funcUtil: '', heatingCooling: '', garage: '', porch: '',
        pool: '', netAdj: '', adjSalePrice: '' },
      { address: '', prox: '', salePrice: '', salePriceGLA: '', dataSource: '', verSource: '',
        saleDate: '', saleType: '', concessions: '', location: '', site: '', view: '',
        designStyle: '', quality: '', age: '', condition: '', aboveGrade: '', gla: '',
        basement: '', funcUtil: '', heatingCooling: '', garage: '', porch: '',
        pool: '', netAdj: '', adjSalePrice: '' },
      { address: '', prox: '', salePrice: '', salePriceGLA: '', dataSource: '', verSource: '',
        saleDate: '', saleType: '', concessions: '', location: '', site: '', view: '',
        designStyle: '', quality: '', age: '', condition: '', aboveGrade: '', gla: '',
        basement: '', funcUtil: '', heatingCooling: '', garage: '', porch: '',
        pool: '', netAdj: '', adjSalePrice: '' },
    ],

    // Income Approach
    grossRentMultiplier: '', potentialGrossIncome: '', vacancyLoss: '',
    effectiveGrossIncome: '', expenses: '', netOperatingIncome: '', capRate: '',
    incomeApproachValue: '',

    // Reconciliation
    scaValue: '', costApproachValue: '', incomeValue: '', reconciledValue: '',
    reconciledValueFormatted: '',
    exposureTime: '', marketingTimeFinal: '',
    reconCommentary: '',

    // Scope / Cert
    inspectionType: 'Interior and Exterior',
    appraiserName: '', appraiserLicense: '', appraiserState: '',
    supervisoryName: '', supervisoryLicense: '',
    effectiveDate: '', signatureDate: '',
  });

  const [activeSection, setActiveSection] = useState('01');
  const [toast, setToast] = useState('');

  const u = (field, value) => setF(prev => ({ ...prev, [field]: value }));
  const uComp = (idx, field, value) => setF(prev => {
    const comps = [...prev.comps];
    comps[idx] = { ...comps[idx], [field]: value };
    return { ...prev, comps };
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const toggleViewFactor = (factor) => {
    const cur = f.viewFactors;
    if (cur.includes(factor)) { u('viewFactors', cur.filter(x => x !== factor)); }
    else if (cur.length < 2) { u('viewFactors', [...cur, factor]); }
    else { showToast('UAD 3.6: Maximum 2 view factors allowed per field.'); }
  };

  // ── Derived conditionals ──────────────────────────────────────────────────
  const isCondo = f.propertyType === 'Condo';
  const isMH = f.propertyType === 'MH';
  const is24Unit = f.propertyType === '2-4 Unit';
  const isPurchase = f.assignmentType === 'Purchase';
  const isDesktop = f.valuationMethod === 'Desktop';
  const isHybrid = f.valuationMethod === 'Hybrid';
  const hasVehicleDetails = f.vehicleStorage !== 'None' && f.vehicleStorage !== '';
  const showDefects = ['C5', 'C6'].includes(f.conditionRating);
  const showIncomeApproach = f.isIncomeProducing || is24Unit;

  // Auto-sync Condo → Project Info
  useEffect(() => { if (isCondo) u('hasProjectInfo', true); else u('hasProjectInfo', false); }, [f.propertyType]);

  const sections = [
    { id: '01', label: 'Summary',                   show: true },
    { id: '02', label: 'Assignment Information',     show: true },
    { id: '03', label: 'Subject Property',           show: true },
    { id: '04', label: 'Sales Contract',             show: isPurchase },
    { id: '05', label: 'Market',                     show: true },
    { id: '06', label: 'Site',                       show: true },
    { id: '07', label: 'Dwelling Exterior',          show: true },
    { id: '08', label: 'Unit Interior',              show: true },
    { id: '09', label: 'Vehicle Storage',            show: hasVehicleDetails },
    { id: '10', label: 'Subject Amenities',          show: true },
    { id: '11', label: 'Quality & Condition',        show: true },
    { id: '12', label: 'Outbuilding',                show: f.hasOutbuilding },
    { id: '13', label: 'Functional Obsolescence',    show: f.hasFunctionalObsolescence },
    { id: '14', label: 'Energy & Green Features',    show: f.hasEnergyFeatures },
    { id: '15', label: 'Manufactured Home',          show: isMH },
    { id: '16', label: 'Project Information',        show: f.hasProjectInfo },
    { id: '17', label: 'ADU / Additional Unit',      show: f.hasADU },
    { id: '18', label: 'Highest & Best Use',         show: true },
    { id: '19', label: 'Subject Listing Info',       show: true },
    { id: '20', label: 'Prior Sale & Transfer',      show: true },
    { id: '21', label: 'Sales Comparison Approach',  show: true },
    { id: '22', label: 'Rental Information',         show: f.isIncomeProducing },
    { id: '23', label: 'Income Approach',            show: showIncomeApproach },
    { id: '24', label: 'Cost Approach',              show: f.showCostApproach },
    { id: '25', label: 'Disaster Mitigation',        show: f.isDisasterArea },
    { id: '26', label: 'Reconciliation',             show: true },
    { id: '27', label: 'Supplemental Information',   show: true },
    { id: '28', label: 'Certification & Scope',      show: true },
  ];

  const visible = sections.filter(s => s.show);
  useEffect(() => {
    if (!visible.find(s => s.id === activeSection)) setActiveSection('01');
  }, [f.propertyType, f.assignmentType, f.vehicleStorage, f.hasOutbuilding,
      f.hasFunctionalObsolescence, f.hasEnergyFeatures, f.isIncomeProducing,
      f.isDisasterArea, f.showCostApproach, f.hasADU, f.hasProjectInfo]);

  // ── Section content renderers ────────────────────────────────────────────
  const content = {

    '01': () => (
      <div>
        <SectionHeader num="01" title="Summary" mandatory />
        <p className="text-xs text-gray-500 mb-4">Core assignment triggers — changing these will show or hide entire sections of this report.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
          <p className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">Assignment Triggers</p>
          <G3>
            <F label="Property Type" req>
              <Sel val={f.propertyType} onChange={v => u('propertyType', v)}
                opts={['SFR','Condo','2-4 Unit','MH']}
                placeholder="Select" />
              {isCondo && <p className="text-xs text-amber-600 mt-1">⚡ Project Information section added</p>}
              {isMH    && <p className="text-xs text-amber-600 mt-1">⚡ Manufactured Home section added</p>}
              {is24Unit && <p className="text-xs text-amber-600 mt-1">⚡ Income Approach section added</p>}
            </F>
            <F label="Assignment Type" req>
              <Sel val={f.assignmentType} onChange={v => u('assignmentType', v)}
                opts={['Refinance','Purchase','Other']}
                placeholder="Select" />
              {isPurchase && <p className="text-xs text-amber-600 mt-1">⚡ Sales Contract section added</p>}
            </F>
            <F label="Valuation Method" req>
              <Sel val={f.valuationMethod} onChange={v => u('valuationMethod', v)}
                opts={['Traditional','Hybrid','Desktop']}
                placeholder="Select" />
              {(isHybrid || isDesktop) && <p className="text-xs text-amber-600 mt-1">⚡ Adjusted scope of work fields</p>}
            </F>
          </G3>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Conditional Section Toggles</p>
          <div className="grid grid-cols-2 gap-3">
            <Toggle on={f.hasOutbuilding} onChange={v => u('hasOutbuilding', v)} label="Has Outbuilding" />
            <Toggle on={f.hasFunctionalObsolescence} onChange={v => u('hasFunctionalObsolescence', v)} label="Functional Obsolescence" />
            <Toggle on={f.hasEnergyFeatures} onChange={v => u('hasEnergyFeatures', v)} label="Energy / Green Features" />
            <Toggle on={f.isIncomeProducing} onChange={v => u('isIncomeProducing', v)} label="Income Producing Property" />
            <Toggle on={f.isDisasterArea} onChange={v => u('isDisasterArea', v)} label="Federal Disaster Area" />
            <Toggle on={f.showCostApproach} onChange={v => u('showCostApproach', v)} label="Include Cost Approach" />
            <Toggle on={f.hasADU} onChange={v => u('hasADU', v)} label="Has ADU / Additional Unit" />
          </div>
        </div>
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
          <p className="text-xs font-semibold text-green-700 mb-1">Active Sections ({visible.length} of {sections.length})</p>
          <p className="text-xs text-green-600">{visible.map(s => s.label).join(' · ')}</p>
        </div>
      </div>
    ),

    '02': () => (
      <div>
        <SectionHeader num="02" title="Assignment Information" mandatory badge={f.valuationMethod} />
        {(isHybrid || isDesktop) && <ConditionalBanner text={`${f.valuationMethod} assignment — interior inspection scope is modified per UAD 3.6.`} />}
        <G2>
          <F label="Client / Lender" req><Input val={f.clientName} onChange={v => u('clientName', v)} /></F>
          <F label="Intended User(s)"><Input val={f.intendedUsers} onChange={v => u('intendedUsers', v)} /></F>
          <F label="Intended Use" req><Input val={f.intendedUse} onChange={v => u('intendedUse', v)} placeholder="Mortgage financing" /></F>
          <F label="Effective Date of Appraisal" req><Input val={f.effectiveDate} onChange={v => u('effectiveDate', v)} type="date" /></F>
          <F label="Property Rights Appraised" req>
            <Sel val={f.propertyRights} onChange={v => u('propertyRights', v)}
              opts={['Fee Simple','Leasehold','Leased Fee','Other']} placeholder="Select" />
          </F>
          <F label="Appraisal Purpose" req>
            <Sel val={f.appraisalPurpose} onChange={v => u('appraisalPurpose', v)}
              opts={['Market Value','As Repaired Value','As Completed Value','Liquidation Value']} placeholder="Select" />
          </F>
        </G2>
        <F label="Scope of Work">
          <Textarea val={f.scopeOfWork} onChange={v => u('scopeOfWork', v)}
            placeholder={isDesktop ? 'Desktop: No physical inspection performed. Data sourced from...' : isHybrid ? 'Hybrid: Property data collected by a third-party PDC. Appraiser reviewed and analyzed...' : 'Traditional: Interior and exterior inspection performed by the appraiser on...'} />
        </F>
        <F label="Assumptions & Limiting Conditions">
          <Textarea val={f.assumptions} onChange={v => u('assumptions', v)} rows={2} />
        </F>
      </div>
    ),

    '03': () => (
      <div>
        <SectionHeader num="03" title="Subject Property" mandatory />
        <G2>
          <F label="Street Address" req><Input val={f.address} onChange={v => u('address', v)} /></F>
          <F label="Unit #"><Input val={f.unitNum} onChange={v => u('unitNum', v)} /></F>
          <F label="City" req><Input val={f.city} onChange={v => u('city', v)} /></F>
          <F label="State" req><Input val={f.state} onChange={v => u('state', v)} /></F>
          <F label="ZIP Code" req><Input val={f.zip} onChange={v => u('zip', v)} /></F>
          <F label="County" req><Input val={f.county} onChange={v => u('county', v)} /></F>
        </G2>
        <G3>
          <F label="Legal Description"><Input val={f.legalDesc} onChange={v => u('legalDesc', v)} /></F>
          <F label="Assessor Parcel #" req><Input val={f.apn} onChange={v => u('apn', v)} /></F>
          <F label="Census Tract"><Input val={f.censusTract} onChange={v => u('censusTract', v)} /></F>
          <F label="Map Reference"><Input val={f.mapRef} onChange={v => u('mapRef', v)} /></F>
          <F label="Tax Year"><Input val={f.taxYear} onChange={v => u('taxYear', v)} /></F>
          <F label="Real Estate Taxes ($)"><Input val={f.reTaxes} onChange={v => u('reTaxes', v)} type="number" /></F>
        </G3>
        <G3>
          <F label="Special Assessments ($)"><Input val={f.specialAssess} onChange={v => u('specialAssess', v)} type="number" /></F>
          <F label="Occupancy" req>
            <Sel val={f.occupancy} onChange={v => u('occupancy', v)}
              opts={['Owner','Tenant','Vacant']} placeholder="Select" />
          </F>
          <F label="HOA" hint={isCondo ? 'HOA details required for Condo' : ''}>
            <Sel val={f.hoa} onChange={v => u('hoa', v)} opts={['Yes','No']} placeholder="Select" />
          </F>
        </G3>
        {f.hoa === 'Yes' && (
          <G3>
            <F label="HOA Dues ($)" req><Input val={f.hoaDues} onChange={v => u('hoaDues', v)} type="number" /></F>
            <F label="HOA Dues Frequency">
              <Sel val={f.hoaFreq} onChange={v => u('hoaFreq', v)} opts={['Monthly','Quarterly','Annual']} placeholder="Select" />
            </F>
            <F label="HOA Fees Include"><Input val={f.hoaIncludes} onChange={v => u('hoaIncludes', v)} /></F>
          </G3>
        )}
      </div>
    ),

    '04': () => (
      <div>
        <SectionHeader num="04" title="Sales Contract" badge="Purchase Only" />
        <ConditionalBanner text="Purchase assignment detected — contract analysis and concession reporting required per UAD 3.6." />
        <G2>
          <F label="Contract Date" req><Input val={f.contractDate} onChange={v => u('contractDate', v)} type="date" /></F>
          <F label="Contract Price ($)" req><Input val={f.contractPrice} onChange={v => u('contractPrice', v)} type="number" /></F>
          <F label="Financing Type" req>
            <Sel val={f.financingType} onChange={v => u('financingType', v)}
              opts={['Conventional','FHA','VA','USDA','Cash','Other']} placeholder="Select" />
          </F>
          <F label="Sale/Concession Type" req>
            <Sel val={f.saleType} onChange={v => u('saleType', v)}
              opts={['ArmLth','REO','Short','Listing','Court','Relo','NonArmLth']} placeholder="Select" />
          </F>
        </G2>
        <G2>
          <F label="Seller Concessions ($)"><Input val={f.concessions} onChange={v => u('concessions', v)} type="number" /></F>
          <F label="Concession Description"><Input val={f.concessionDesc} onChange={v => u('concessionDesc', v)} /></F>
        </G2>
        <F label="Contract Analysis Commentary" req>
          <Textarea val={f.contractAnalysis} onChange={v => u('contractAnalysis', v)}
            placeholder="Summarize results of contract analysis, or explain if contract was not made available..." />
        </F>
      </div>
    ),

    '05': () => (
      <div>
        <SectionHeader num="05" title="Market" mandatory />
        <F label="Neighborhood Boundaries" req><Input val={f.neighborhoodBoundaries} onChange={v => u('neighborhoodBoundaries', v)} /></F>
        <F label="Neighborhood Description"><Textarea val={f.neighborhoodDesc} onChange={v => u('neighborhoodDesc', v)} rows={2} /></F>
        <G3>
          <F label="Land Use 1-Unit %"><Input val={f.landUse1Unit} onChange={v => u('landUse1Unit', v)} type="number" /></F>
          <F label="Land Use 2-4 Unit %"><Input val={f.landUse24Unit} onChange={v => u('landUse24Unit', v)} type="number" /></F>
          <F label="Commercial %"><Input val={f.landUseCommercial} onChange={v => u('landUseCommercial', v)} type="number" /></F>
        </G3>
        <G3>
          <F label="Property Values" req>
            <Sel val={f.propertyValues} onChange={v => u('propertyValues', v)}
              opts={['Increasing','Stable','Declining']} placeholder="Select" />
          </F>
          <F label="Demand/Supply" req>
            <Sel val={f.demandSupply} onChange={v => u('demandSupply', v)}
              opts={['Shortage','In Balance','Over Supply']} placeholder="Select" />
          </F>
          <F label="Marketing Time" req>
            <Sel val={f.marketingTime} onChange={v => u('marketingTime', v)}
              opts={['Under 3 Months','3-6 Months','Over 6 Months']} placeholder="Select" />
          </F>
        </G3>
        <G3>
          <F label="Price Range Low ($)"><Input val={f.priceRangeLow} onChange={v => u('priceRangeLow', v)} type="number" /></F>
          <F label="Price Range High ($)"><Input val={f.priceRangeHigh} onChange={v => u('priceRangeHigh', v)} type="number" /></F>
          <F label="Predominant Price ($)"><Input val={f.priceRangePred} onChange={v => u('priceRangePred', v)} type="number" /></F>
          <F label="Age Range Low (yrs)"><Input val={f.ageLow} onChange={v => u('ageLow', v)} type="number" /></F>
          <F label="Age Range High (yrs)"><Input val={f.ageHigh} onChange={v => u('ageHigh', v)} type="number" /></F>
          <F label="Predominant Age (yrs)"><Input val={f.agePred} onChange={v => u('agePred', v)} type="number" /></F>
        </G3>
        <F label="Market Commentary"><Textarea val={f.marketCommentary} onChange={v => u('marketCommentary', v)} rows={2} /></F>
      </div>
    ),

    '06': () => (
      <div>
        <SectionHeader num="06" title="Site" mandatory />
        <G3>
          <F label="Site Area" req><Input val={f.siteArea} onChange={v => u('siteArea', v)} type="number" /></F>
          <F label="Unit">
            <Sel val={f.siteUnit} onChange={v => u('siteUnit', v)} opts={['sq ft','acres']} />
          </F>
          <F label="Shape">
            <Sel val={f.siteShape} onChange={v => u('siteShape', v)}
              opts={['Rectangular','Irregular','Flag Lot','Triangular','Other']} placeholder="Select" />
          </F>
          <F label="Zoning Classification" req><Input val={f.zoning} onChange={v => u('zoning', v)} /></F>
          <F label="Zoning Description"><Input val={f.zoningDesc} onChange={v => u('zoningDesc', v)} /></F>
          <F label="Zoning Compliance" req>
            <Sel val={f.zoningCompliance} onChange={v => u('zoningCompliance', v)}
              opts={['Legal','Legal Non-Conforming','Illegal','No Zoning']} placeholder="Select" />
          </F>
          <F label="Street Type">
            <Sel val={f.streetType} onChange={v => u('streetType', v)}
              opts={['Public','Private','None']} placeholder="Select" />
          </F>
          <F label="Street Surface">
            <Sel val={f.streetSurface} onChange={v => u('streetSurface', v)}
              opts={['Paved','Gravel','Dirt','Other']} placeholder="Select" />
          </F>
          <F label="Alley">
            <Sel val={f.alley} onChange={v => u('alley', v)}
              opts={['None','Paved','Gravel']} placeholder="Select" />
          </F>
        </G3>
        <G2>
          <F label="Utilities — Electric">
            <Sel val={f.utilElectric} onChange={v => u('utilElectric', v)}
              opts={['Public','Community','Private','None']} placeholder="Select" />
          </F>
          <F label="Utilities — Gas">
            <Sel val={f.utilGas} onChange={v => u('utilGas', v)}
              opts={['Public','Community','Private','None']} placeholder="Select" />
          </F>
          <F label="Utilities — Water">
            <Sel val={f.utilWater} onChange={v => u('utilWater', v)}
              opts={['Public','Community','Well — Individual','Shared Well','None']} placeholder="Select" />
          </F>
          <F label="Utilities — Sewer">
            <Sel val={f.utilSewer} onChange={v => u('utilSewer', v)}
              opts={['Public','Community','Septic — Individual','Shared Septic','None']} placeholder="Select" />
          </F>
        </G2>
        <div className="border-t border-gray-200 pt-4 mt-2">
          <div className="mb-3">
            <Toggle on={f.hasWaterFrontage} onChange={v => u('hasWaterFrontage', v)} label="Water Frontage Present" />
          </div>
          {f.hasWaterFrontage && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <ConditionalBanner text="Water frontage documentation required — photos must be included in Site Exhibits with caption 'Water Frontage'." />
              <G2>
                <F label="Water Frontage Type" req>
                  <Sel val={f.waterFrontageType} onChange={v => u('waterFrontageType', v)}
                    opts={['Ocean','Bay','River','Lake','Canal','Creek','Pond','Other']} placeholder="Select" />
                </F>
                <F label="Access">
                  <Sel val={f.waterFrontageAccess} onChange={v => u('waterFrontageAccess', v)}
                    opts={['Private','Shared','Public']} placeholder="Select" />
                </F>
                <F label="Linear Footage"><Input val={f.waterLinFt} onChange={v => u('waterLinFt', v)} type="number" /></F>
                <F label="Water Frontage Commentary"><Input val={f.waterFrontageComm} onChange={v => u('waterFrontageComm', v)} /></F>
              </G2>
            </div>
          )}
        </div>
        <F label="Site Topography"><Input val={f.siteTopography} onChange={v => u('siteTopography', v)} /></F>
        <F label="Site Influences / External Factors"><Input val={f.siteInfluences} onChange={v => u('siteInfluences', v)} placeholder="e.g., Hwy Busy, PwrLn Neg, IndustrAdjcnt" /></F>
        <F label="Site Commentary"><Textarea val={f.siteCommentary} onChange={v => u('siteCommentary', v)} rows={2} /></F>
      </div>
    ),

    '07': () => (
      <div>
        <SectionHeader num="07" title="Dwelling Exterior" mandatory />
        {isMH && <ConditionalBanner text="Manufactured home detected — HUD tag, serial number, and manufacturer fields required in Section 15." />}
        <G3>
          <F label="Year Built" req><Input val={f.yearBuilt} onChange={v => u('yearBuilt', v)} type="number" /></F>
          <F label="Effective Age (yrs)"><Input val={f.effectiveAge} onChange={v => u('effectiveAge', v)} type="number" /></F>
          <F label="Stories" req><Input val={f.stories} onChange={v => u('stories', v)} type="number" /></F>
          <F label="Design / Style" req>
            <Sel val={f.designStyle} onChange={v => u('designStyle', v)}
              opts={['Ranch','Colonial','Split Level','Contemporary','Victorian','Bi-Level','Townhouse','Row','Other']} placeholder="Select" />
          </F>
          <F label="Construction Method" req>
            <Sel val={f.manufacturingMethod} onChange={v => u('manufacturingMethod', v)}
              opts={['Site-Built','Modular','Manufactured','Panelized']} />
          </F>
          <F label="Foundation" req>
            <Sel val={f.foundationType} onChange={v => u('foundationType', v)}
              opts={['Concrete Slab','Crawl Space','Full Basement','Partial Basement','Pier & Beam','Other']} placeholder="Select" />
          </F>
          <F label="Exterior Walls" req>
            <Sel val={f.exteriorWalls} onChange={v => u('exteriorWalls', v)}
              opts={['Brick','Vinyl Siding','Wood Siding','Stucco','Fiber Cement','Stone','EIFS','Other']} placeholder="Select" />
          </F>
          <F label="Roof Surface" req>
            <Sel val={f.roofSurface} onChange={v => u('roofSurface', v)}
              opts={['Asphalt Shingle','Metal','Tile','Wood Shake','Slate','Built-Up','Other']} placeholder="Select" />
          </F>
          <F label="Roof Type">
            <Sel val={f.roofType} onChange={v => u('roofType', v)}
              opts={['Gable','Hip','Flat','Mansard','Shed','Gambrel','Mixed','Other']} placeholder="Select" />
          </F>
          <F label="Window Type">
            <Sel val={f.windowType} onChange={v => u('windowType', v)}
              opts={['Single Pane','Double Pane','Triple Pane','Storm','Other']} placeholder="Select" />
          </F>
        </G3>
        <div className="flex gap-6 mb-4">
          <Toggle on={f.gutters} onChange={v => u('gutters', v)} label="Gutters / Downspouts" />
          <Toggle on={f.stormSash} onChange={v => u('stormSash', v)} label="Storm Sash" />
          <Toggle on={f.screens} onChange={v => u('screens', v)} label="Screens" />
        </div>

        {/* Vehicle Storage trigger lives here */}
        <div className="border-t border-gray-200 pt-4 mt-2">
          <F label="Vehicle Storage Type" req hint={f.vehicleStorage !== 'None' ? 'Vehicle Storage section added to navigator' : ''}>
            <Sel val={f.vehicleStorage} onChange={v => u('vehicleStorage', v)}
              opts={['None','Driveway','Carport','Garage — Attached','Garage — Detached','Garage — Built-In','Parking Structure','Other']}
              placeholder="Select" />
          </F>
        </div>
        <F label="Dwelling Exterior Commentary"><Textarea val={f.dwellExtComm} onChange={v => u('dwellExtComm', v)} rows={2} /></F>
      </div>
    ),

    '08': () => (
      <div>
        <SectionHeader num="08" title="Unit Interior" mandatory />
        <G3>
          <F label="Gross Living Area (ANSI)" req hint="ANSI Z765 — above grade only">
            <Input val={f.gla} onChange={v => u('gla', v)} type="number" placeholder="sq ft" />
          </F>
          <F label="Below Grade Total Sq Ft"><Input val={f.glaBelowGrade} onChange={v => u('glaBelowGrade', v)} type="number" /></F>
          <F label="Below Grade Finished Sq Ft"><Input val={f.belowGradeFinished} onChange={v => u('belowGradeFinished', v)} type="number" /></F>
          <F label="Bedrooms (Above Grade)" req><Input val={f.bedrooms} onChange={v => u('bedrooms', v)} type="number" /></F>
          <F label="Full Baths (Above Grade)" req><Input val={f.bathrooms} onChange={v => u('bathrooms', v)} type="number" /></F>
          <F label="Half Baths"><Input val={f.halfBaths} onChange={v => u('halfBaths', v)} type="number" /></F>
          <F label="Floor Covering">
            <Sel val={f.floors} onChange={v => u('floors', v)}
              opts={['Hardwood','Carpet','Tile','Vinyl','Laminate','Concrete','Mixed','Other']} placeholder="Select" />
          </F>
          <F label="Walls">
            <Sel val={f.walls} onChange={v => u('walls', v)}
              opts={['Drywall','Plaster','Paneling','Other']} placeholder="Select" />
          </F>
          <F label="Trim / Finish">
            <Sel val={f.trimFinish} onChange={v => u('trimFinish', v)}
              opts={['Paint','Stain','Other']} placeholder="Select" />
          </F>
          <F label="Heating Type" req>
            <Sel val={f.heatingType} onChange={v => u('heatingType', v)}
              opts={['Forced Air','Radiant','Baseboard','Heat Pump','Geothermal','None']} placeholder="Select" />
          </F>
          <F label="Heating Fuel">
            <Sel val={f.heatingFuel} onChange={v => u('heatingFuel', v)}
              opts={['Natural Gas','Electric','Oil','Propane','Solar','Other']} placeholder="Select" />
          </F>
          <F label="Cooling Type" req>
            <Sel val={f.coolingType} onChange={v => u('coolingType', v)}
              opts={['Central Air','Wall Unit','Evaporative','Heat Pump','None']} placeholder="Select" />
          </F>
        </G3>
        <G2>
          <F label="Fireplace Type">
            <Sel val={f.amenitiesFireplace} onChange={v => u('amenitiesFireplace', v)}
              opts={['None','Wood Burning','Gas','Electric','Other']} placeholder="Select" />
          </F>
          {f.amenitiesFireplace && f.amenitiesFireplace !== 'None' && (
            <F label="# of Fireplaces"><Input val={f.amenitiesFireplaceCount} onChange={v => u('amenitiesFireplaceCount', v)} type="number" /></F>
          )}
        </G2>
        <div className="border-t border-gray-200 pt-4 mt-2">
          <Toggle on={f.hasADU} onChange={v => u('hasADU', v)} label="Accessory Dwelling Unit (ADU) Present" />
          {f.hasADU && <p className="text-xs text-amber-600 mt-1 ml-12">⚡ ADU / Additional Unit section added to navigator</p>}
        </div>
        <F label="Interior Commentary"><Textarea val={f.interiorComm} onChange={v => u('interiorComm', v)} rows={2} /></F>
      </div>
    ),

    '09': () => (
      <div>
        <SectionHeader num="09" title="Vehicle Storage" badge={f.vehicleStorage} />
        <ConditionalBanner text={`Vehicle storage type "${f.vehicleStorage}" detected — additional documentation required.`} />
        <G3>
          <F label="# of Spaces" req><Input val={f.vehicleSpaces} onChange={v => u('vehicleSpaces', v)} type="number" /></F>
          <F label="Size (sq ft)"><Input val={f.vehicleSize} onChange={v => u('vehicleSize', v)} type="number" /></F>
          <F label="Condition">
            <Sel val={f.vehicleCondition} onChange={v => u('vehicleCondition', v)}
              opts={['C1','C2','C3','C4','C5','C6']} placeholder="Select" />
          </F>
        </G3>
        <F label="Vehicle Storage Commentary"><Textarea val={f.vehicleComm} onChange={v => u('vehicleComm', v)} rows={2} /></F>
      </div>
    ),

    '10': () => (
      <div>
        <SectionHeader num="10" title="Subject Property Amenities" mandatory />
        <p className="text-xs text-gray-500 mb-3">Select all amenities present. Relevant toggles may unlock additional conditional sections.</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[['pool','Pool'],['spa','Spa/Hot Tub'],['fence','Fence'],['patio','Patio'],
            ['deck','Deck'],['porch','Porch'],['shed','Storage Shed']].map(([key, lbl]) => (
            <Toggle key={key} on={f[key]} onChange={v => u(key, v)} label={lbl} />
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4">
          <Toggle on={f.hasEnergyFeatures} onChange={v => u('hasEnergyFeatures', v)} label="Energy / Green Features Present" />
          {f.hasEnergyFeatures && <p className="text-xs text-amber-600 mt-1 ml-12">⚡ Energy & Green Features section added to navigator</p>}
        </div>
        <div className="border-t border-gray-200 pt-4 mt-3">
          <Toggle on={f.hasOutbuilding} onChange={v => u('hasOutbuilding', v)} label="Outbuilding Present" />
          {f.hasOutbuilding && <p className="text-xs text-amber-600 mt-1 ml-12">⚡ Outbuilding section added to navigator</p>}
        </div>
        <F label="Amenities Commentary"><Textarea val={f.amenitiesComm} onChange={v => u('amenitiesComm', v)} rows={2} /></F>
      </div>
    ),

    '11': () => (
      <div>
        <SectionHeader num="11" title="Overall Quality & Condition" mandatory />

        {/* Quality */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-600 mb-2">Quality Rating <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-6 gap-2">
            {['Q1','Q2','Q3','Q4','Q5','Q6'].map(q => (
              <button key={q} onClick={() => u('qualityRating', q)}
                className={`py-2 rounded border text-sm font-bold transition-colors ${f.qualityRating === q ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                {q}
              </button>
            ))}
          </div>
          {f.qualityRating && (
            <p className="text-xs text-blue-600 mt-2">
              {{Q1:'Exceptional — unique architectural design, highest quality materials.',
                Q2:'Excellent — superior quality finishes, exceptional craftsmanship.',
                Q3:'Good — superior construction with quality finishes above standard.',
                Q4:'Average — standard quality, meets minimum building codes.',
                Q5:'Fair — basic construction, may not meet current codes.',
                Q6:'Poor — severe deficiencies, unsafe or unfit for occupancy.'}[f.qualityRating]}
            </p>
          )}
        </div>

        {/* Condition */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-600 mb-2">Condition Rating <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-6 gap-2">
            {['C1','C2','C3','C4','C5','C6'].map(c => (
              <button key={c} onClick={() => u('conditionRating', c)}
                className={`py-2 rounded border text-sm font-bold transition-colors ${f.conditionRating === c
                  ? c === 'C5' || c === 'C6' ? 'bg-red-600 text-white border-red-600' : 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                {c}
              </button>
            ))}
          </div>
          {f.conditionRating && (
            <p className={`text-xs mt-2 ${showDefects ? 'text-red-600 font-semibold' : 'text-blue-600'}`}>
              {{C1:'New construction — never previously occupied.',
                C2:'Excellent — no deferred maintenance, recently updated.',
                C3:'Good — minor deferred maintenance, well maintained overall.',
                C4:'Average — some deferred maintenance, adequate condition.',
                C5:'Fair — significant deferred maintenance, deficiencies present.',
                C6:'Poor — severe deferred maintenance, potential safety hazards.'}[f.conditionRating]}
              {showDefects && ' ⚡ Defects & deficiency fields required below.'}
            </p>
          )}
        </div>

        {/* Defects — conditional on C5/C6 */}
        {showDefects && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-xs font-bold text-red-700 mb-3 uppercase">Required: Defects & Deficiencies ({f.conditionRating})</p>
            <F label="Physical Defects / Deficiencies" req>
              <Textarea val={f.defects} onChange={v => u('defects', v)}
                placeholder="Describe all observable physical defects, damages, and deficiencies..." rows={3} />
            </F>
            <F label="Physical Deficiencies Affecting Safety / Livability" req>
              <Textarea val={f.physicalDeficiencies} onChange={v => u('physicalDeficiencies', v)}
                placeholder="Describe deficiencies affecting safety or habitability..." rows={2} />
            </F>
            <F label="Adverse Environmental Conditions">
              <Textarea val={f.adverseEnvConditions} onChange={v => u('adverseEnvConditions', v)}
                placeholder="Describe any hazardous substances, environmental contamination..." rows={2} />
            </F>
            <div className="mt-3">
              <Toggle on={f.hasFunctionalObsolescence} onChange={v => u('hasFunctionalObsolescence', v)} label="Functional Obsolescence Present" />
              {f.hasFunctionalObsolescence && <p className="text-xs text-amber-600 mt-1 ml-12">⚡ Functional Obsolescence section added to navigator</p>}
            </div>
          </div>
        )}

        {/* Updates */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-600 mb-3">Update Level</p>
          <G3>
            <F label="Kitchen Update">
              <Sel val={f.kitchenUpdate} onChange={v => u('kitchenUpdate', v)}
                opts={['No Updates','Minor Updates','Significant Updates','Fully Remodeled']} placeholder="Select" />
            </F>
            <F label="Bath Update">
              <Sel val={f.bathUpdate} onChange={v => u('bathUpdate', v)}
                opts={['No Updates','Minor Updates','Significant Updates','Fully Remodeled']} placeholder="Select" />
            </F>
            <F label="Other Updates">
              <Sel val={f.otherUpdate} onChange={v => u('otherUpdate', v)}
                opts={['No Updates','Minor Updates','Significant Updates','Fully Remodeled']} placeholder="Select" />
            </F>
          </G3>
          <F label="Update Timeframe">
            <Sel val={f.updateTimeframe} onChange={v => u('updateTimeframe', v)}
              opts={['0-5 Yrs','6-10 Yrs','11-15 Yrs','16-20 Yrs','20+ Yrs','Unknown']} placeholder="Select" />
          </F>
        </div>

        {/* View */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">View Rating <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[['N','Neutral'],['B','Beneficial'],['A','Adverse']].map(([v, lbl]) => (
              <button key={v} onClick={() => { u('viewRating', v); u('viewFactors', []); }}
                className={`py-2 rounded border text-sm font-bold transition-colors ${f.viewRating === v
                  ? v === 'A' ? 'bg-red-500 text-white border-red-500' : v === 'B' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-500 text-white border-gray-500'
                  : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}>
                {v} — {lbl}
              </button>
            ))}
          </div>
          {f.viewRating && (
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">View Factors <span className="text-gray-400">(select 1–2)</span></p>
              <div className="flex flex-wrap gap-2">
                {['Wtr','Pstrl','Res','Ind','Busy Str','Lt Traf','Lmtd Sgt','Prk Vw','Str Vw','Mtn Vw','CtyVw','GlfVw','WtrFr'].map(vf => (
                  <button key={vf} onClick={() => toggleViewFactor(vf)}
                    className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${f.viewFactors.includes(vf) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                    {vf}
                  </button>
                ))}
              </div>
              {f.viewFactors.length > 0 && <p className="text-xs text-blue-600 mt-2">Selected: {f.viewFactors.join(', ')}</p>}
            </div>
          )}
        </div>
        <F label="Quality & Condition Commentary" req>
          <Textarea val={f.qcCommentary} onChange={v => u('qcCommentary', v)}
            placeholder="Describe quality and condition observations supporting the ratings above..." rows={3} />
        </F>
      </div>
    ),

    '12': () => (
      <div>
        <SectionHeader num="12" title="Outbuilding" />
        <ConditionalBanner text="Outbuilding present — document all outbuildings on the subject site." />
        <G3>
          <F label="Outbuilding Type" req>
            <Sel val={f.outbuildingType} onChange={v => u('outbuildingType', v)}
              opts={['Barn','Workshop','Guest House','Storage','Pool House','Greenhouse','Other']} placeholder="Select" />
          </F>
          <F label="Size (sq ft)" req><Input val={f.outbuildingSize} onChange={v => u('outbuildingSize', v)} type="number" /></F>
          <F label="Condition">
            <Sel val={f.outbuildingCondition} onChange={v => u('outbuildingCondition', v)}
              opts={['C1','C2','C3','C4','C5','C6']} placeholder="Select" />
          </F>
        </G3>
        <F label="Outbuilding Commentary"><Textarea val={f.outbuildingComm} onChange={v => u('outbuildingComm', v)} rows={2} /></F>
      </div>
    ),

    '13': () => (
      <div>
        <SectionHeader num="13" title="Functional Obsolescence" />
        <ConditionalBanner text="Functional obsolescence requires description and must be considered in value conclusions." />
        <F label="Description of Functional Obsolescence" req>
          <Textarea val={f.functionalObsDesc} onChange={v => u('functionalObsDesc', v)}
            placeholder="Describe functional obsolescence — e.g., non-conforming floor plan, outdated mechanical systems, excess/deficient room count, poor layout..." rows={4} />
        </F>
        <G2>
          <F label="Type">
            <Sel val={f.functionalObsType} onChange={v => u('functionalObsType', v)}
              opts={['Curable','Incurable','Both']} placeholder="Select" />
          </F>
          <F label="Estimated Impact on Value ($)"><Input val={f.functionalObsValue} onChange={v => u('functionalObsValue', v)} type="number" /></F>
        </G2>
      </div>
    ),

    '14': () => (
      <div>
        <SectionHeader num="14" title="Energy & Green Features" />
        <ConditionalBanner text="Energy-efficient features detected — document all green/energy components and any certifications." />
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[['energySolar','Solar Panels'],['energyGeothermal','Geothermal'],['energyWindTurbine','Wind Turbine'],
            ['energyBattery','Battery Storage'],['energyEV','EV Charger'],['energySmartHome','Smart Home Systems']].map(([key, lbl]) => (
            <Toggle key={key} on={f[key]} onChange={v => u(key, v)} label={lbl} />
          ))}
        </div>
        <G2>
          <F label="Green Certification Program">
            <Sel val={f.greenCertification} onChange={v => u('greenCertification', v)}
              opts={['LEED','ENERGY STAR','Green Point Rated','HERS Rated','NGBS','Other','None']} placeholder="Select" />
          </F>
          <F label="Other Energy Features"><Input val={f.energyOther} onChange={v => u('energyOther', v)} /></F>
        </G2>
        <F label="Energy Features Commentary"><Textarea val={f.energyComm} onChange={v => u('energyComm', v)} rows={2} /></F>
      </div>
    ),

    '15': () => (
      <div>
        <SectionHeader num="15" title="Manufactured Home" badge="MH" />
        <ConditionalBanner text="Manufactured home — HUD compliance documentation required." />
        <G2>
          <F label="Manufacturer Name" req><Input val={f.mhManufacturer} onChange={v => u('mhManufacturer', v)} /></F>
          <F label="Model Name / Year"><Input val={f.mhModel} onChange={v => u('mhModel', v)} /></F>
          <F label="HUD Certification Tag #" req><Input val={f.mhHUDTag} onChange={v => u('mhHUDTag', v)} /></F>
          <F label="Serial / VIN #" req><Input val={f.mhSerial} onChange={v => u('mhSerial', v)} /></F>
          <F label="Data Plate Location"><Input val={f.mhDataPlate} onChange={v => u('mhDataPlate', v)} /></F>
          <F label="Title Status">
            <Sel val={f.mhTitleStatus} onChange={v => u('mhTitleStatus', v)}
              opts={['Personal Property','Real Property','Unknown']} placeholder="Select" />
          </F>
          <F label="Foundation Type" req>
            <Sel val={f.mhFoundation} onChange={v => u('mhFoundation', v)}
              opts={['HUD Permanent Foundation','Piers','Blocking','Other']} placeholder="Select" />
          </F>
          <F label="Section Type">
            <Sel val={f.mhSectionType} onChange={v => u('mhSectionType', v)}
              opts={['Single-Wide','Double-Wide','Triple-Wide','Other']} placeholder="Select" />
          </F>
        </G2>
        <F label="Manufactured Home Commentary"><Textarea val={f.mhComm} onChange={v => u('mhComm', v)} rows={2} /></F>
      </div>
    ),

    '16': () => (
      <div>
        <SectionHeader num="16" title="Project Information" badge="Condo" />
        <ConditionalBanner text="Condominium project — complete all project fields. HOA financials and project classification required." />
        <G2>
          <F label="Project Name" req><Input val={f.projectName} onChange={v => u('projectName', v)} /></F>
          <F label="Project Type" req>
            <Sel val={f.projectType} onChange={v => u('projectType', v)}
              opts={['Detached','Attached','2-4 Unit','PUD','High-Rise','Mid-Rise','Garden Style','Other']} placeholder="Select" />
          </F>
          <F label="Total Units in Project"><Input val={f.projectUnits} onChange={v => u('projectUnits', v)} type="number" /></F>
          <F label="Phase #"><Input val={f.projectPhase} onChange={v => u('projectPhase', v)} /></F>
          <F label="% Owner Occupied"><Input val={f.projectOwnerOcc} onChange={v => u('projectOwnerOcc', v)} type="number" /></F>
          <F label="% Units Sold"><Input val={f.projectSoldPct} onChange={v => u('projectSoldPct', v)} type="number" /></F>
          <F label="HOA Monthly Dues ($)" req><Input val={f.hoaDues} onChange={v => u('hoaDues', v)} type="number" /></F>
          <F label="HOA Dues Include"><Input val={f.hoaFeeIncludes} onChange={v => u('hoaFeeIncludes', v)} placeholder="Insurance, Water, Trash..." /></F>
        </G2>
        <F label="Project Description / Commentary"><Textarea val={f.projectComm} onChange={v => u('projectComm', v)} rows={2} /></F>
      </div>
    ),

    '17': () => (
      <div>
        <SectionHeader num="17" title="ADU / Additional Unit" badge="ADU" />
        <ConditionalBanner text="ADU present — document all additional units. Rental income and additional GLA must be reported separately." />
        <G3>
          <F label="ADU Type" req>
            <Sel val={f.aduType} onChange={v => u('aduType', v)}
              opts={['Attached','Detached','Garage Conversion','Basement','Junior ADU','Other']} placeholder="Select" />
          </F>
          <F label="ADU GLA (sq ft)" req><Input val={f.aduGLA} onChange={v => u('aduGLA', v)} type="number" /></F>
          <F label="ADU Bedrooms"><Input val={f.aduBed} onChange={v => u('aduBed', v)} type="number" /></F>
          <F label="ADU Baths"><Input val={f.aduBath} onChange={v => u('aduBath', v)} type="number" /></F>
          <F label="ADU Monthly Rent ($)"><Input val={f.aduRent} onChange={v => u('aduRent', v)} type="number" /></F>
          <F label="ADU Condition">
            <Sel val={f.aduCondition} onChange={v => u('aduCondition', v)} opts={['C1','C2','C3','C4','C5','C6']} placeholder="Select" />
          </F>
        </G3>
        <F label="ADU Commentary"><Textarea val={f.aduComm} onChange={v => u('aduComm', v)} rows={2} /></F>
      </div>
    ),

    '18': () => (
      <div>
        <SectionHeader num="18" title="Highest & Best Use" mandatory />
        <G2>
          <F label="As If Vacant" req>
            <Sel val={f.hbuVacant} onChange={v => u('hbuVacant', v)}
              opts={['Present Use is HBU','Other Use is HBU']} placeholder="Select" />
          </F>
          <F label="As Improved" req>
            <Sel val={f.hbuImproved} onChange={v => u('hbuImproved', v)}
              opts={['Present Use is HBU','Demolition & Redevelopment','Renovation / Conversion']} placeholder="Select" />
          </F>
        </G2>
        <F label="HBU Commentary"><Textarea val={f.hbuComm} onChange={v => u('hbuComm', v)} rows={3} placeholder="Support the HBU conclusion — legally permissible, physically possible, financially feasible, maximally productive..." /></F>
      </div>
    ),

    '19': () => (
      <div>
        <SectionHeader num="19" title="Subject Listing Information" mandatory />
        <F label="Prior Listings in Last 12 Months" req>
          <Sel val={f.priorListings} onChange={v => u('priorListings', v)} opts={['None','1','2','3+']} placeholder="Select" />
        </F>
        {f.priorListings && f.priorListings !== 'None' && (
          <G3>
            <F label="Listing Date"><Input val={f.listingDate} onChange={v => u('listingDate', v)} type="date" /></F>
            <F label="Listing Price ($)"><Input val={f.listingPrice} onChange={v => u('listingPrice', v)} type="number" /></F>
            <F label="Days on Market"><Input val={f.listingDays} onChange={v => u('listingDays', v)} type="number" /></F>
          </G3>
        )}
        <F label="Listing Commentary"><Textarea val={f.listingComm} onChange={v => u('listingComm', v)} rows={2} /></F>
      </div>
    ),

    '20': () => (
      <div>
        <SectionHeader num="20" title="Prior Sale & Transfer History" mandatory />
        <G2>
          <F label="Prior Sale in Last 12 Months?">
            <Sel val={f.priorSale12} onChange={v => u('priorSale12', v)} opts={['No','Yes']} />
          </F>
          {f.priorSale12 === 'Yes' && <>
            <F label="Sale Date"><Input val={f.priorSale12Date} onChange={v => u('priorSale12Date', v)} type="date" /></F>
            <F label="Sale Price ($)"><Input val={f.priorSale12Price} onChange={v => u('priorSale12Price', v)} type="number" /></F>
          </>}
          <F label="Prior Sale in Last 36 Months?">
            <Sel val={f.priorSale36} onChange={v => u('priorSale36', v)} opts={['No','Yes']} />
          </F>
          {f.priorSale36 === 'Yes' && <>
            <F label="Sale Date"><Input val={f.priorSale36Date} onChange={v => u('priorSale36Date', v)} type="date" /></F>
            <F label="Sale Price ($)"><Input val={f.priorSale36Price} onChange={v => u('priorSale36Price', v)} type="number" /></F>
          </>}
        </G2>
        <F label="Transfer History Commentary"><Textarea val={f.priorSaleComm} onChange={v => u('priorSaleComm', v)} rows={2} /></F>
      </div>
    ),

    '21': () => {
      const adjFields = [
        'Sale/Financing Concessions','Date of Sale','Location','Site','View',
        'Design/Style','Quality','Age','Condition','Above Grade Room Count',
        'GLA (sq ft)','Basement/Fin Rooms Below Grade','Functional Utility',
        'Heating/Cooling','Energy Efficient Items','Garage/Carport',
        'Porch/Patio/Deck','Pool','Other'
      ];
      return (
        <div>
          <SectionHeader num="21" title="Sales Comparison Approach" mandatory />
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-2 text-left w-40">Feature</th>
                  <th className="p-2 text-left w-48">Subject</th>
                  {[1,2,3].map(n => <th key={n} className="p-2 text-left w-48">Comparable {n}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Address', 'address', null, 'text'],
                  ['Prox to Subject', 'prox', null, 'text'],
                  ['Sale Price ($)', 'salePrice', null, 'number'],
                  ['Sale Price/GLA', 'salePriceGLA', null, 'text'],
                  ['Data Source', 'dataSource', null, 'text'],
                  ['Verification Source', 'verSource', null, 'text'],
                ].map(([label, field, subjectField, type]) => (
                  <tr key={field} className="border-b border-gray-200 even:bg-gray-50">
                    <td className="p-2 font-semibold text-gray-600">{label}</td>
                    <td className="p-2 text-gray-500 italic text-xs">
                      {label === 'Address' ? f.address || '—' :
                       label === 'Sale Price ($)' ? 'N/A' :
                       label === 'GLA' ? (f.gla || '—') + ' sq ft' : '—'}
                    </td>
                    {[0,1,2].map(i => (
                      <td key={i} className="p-2">
                        <input type={type} className="w-full border border-gray-200 rounded px-1 py-0.5 text-xs"
                          value={f.comps[i][field] || ''}
                          onChange={e => uComp(i, field, e.target.value)} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-blue-50">
                  <td colSpan="5" className="p-2 text-xs font-bold text-blue-700 uppercase">Adjustment Grid</td>
                </tr>
                {adjFields.map(adjField => (
                  <tr key={adjField} className="border-b border-gray-100 even:bg-gray-50">
                    <td className="p-2 font-medium text-gray-600 text-xs">{adjField}</td>
                    <td className="p-2 text-xs text-gray-500 italic">
                      {adjField === 'View' && f.viewRating ? `${f.viewRating};${f.viewFactors.join(',')}` :
                       adjField === 'Quality' && f.qualityRating ? f.qualityRating :
                       adjField === 'Condition' && f.conditionRating ? f.conditionRating :
                       adjField === 'GLA (sq ft)' && f.gla ? f.gla + ' sq ft' : '—'}
                    </td>
                    {[0,1,2].map(i => (
                      <td key={i} className="p-2">
                        <input className="w-full border border-gray-200 rounded px-1 py-0.5 text-xs"
                          value={f.comps[i][adjField.replace(/[^a-z]/gi,'_')] || ''}
                          onChange={e => uComp(i, adjField.replace(/[^a-z]/gi,'_'), e.target.value)}
                          placeholder="+/−" />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-green-50 font-bold">
                  <td className="p-2 text-xs font-bold text-green-700">Adjusted Sale Price</td>
                  <td className="p-2 text-xs text-gray-400">—</td>
                  {[0,1,2].map(i => (
                    <td key={i} className="p-2">
                      <input className="w-full border border-green-300 rounded px-1 py-0.5 text-xs font-bold bg-white"
                        value={f.comps[i].adjSalePrice || ''}
                        onChange={e => uComp(i, 'adjSalePrice', e.target.value)}
                        placeholder="$" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <F label="Sales Comparison Approach Commentary" req>
              <Textarea val={f.scaCommentary} onChange={v => u('scaCommentary', v)}
                placeholder="Explain selection of comparables, adjustments, and support for SCA value conclusion..." rows={3} />
            </F>
            <F label="Indicated Value by Sales Comparison Approach ($)" req>
              <Input val={f.scaValue} onChange={v => u('scaValue', v)} type="number" />
            </F>
          </div>
        </div>
      );
    },

    '22': () => (
      <div>
        <SectionHeader num="22" title="Rental Information" badge="Income Producing" />
        <ConditionalBanner text="Income producing property — rental data required for Income Approach analysis." />
        <G3>
          <F label="Monthly Market Rent ($)" req><Input val={f.monthlyRent} onChange={v => u('monthlyRent', v)} type="number" /></F>
          <F label="Rent Basis">
            <Sel val={f.rentBasis} onChange={v => u('rentBasis', v)} opts={['Furnished','Unfurnished']} placeholder="Select" />
          </F>
          <F label="Vacancy Rate %"><Input val={f.rentVacancy} onChange={v => u('rentVacancy', v)} type="number" /></F>
        </G3>
        <F label="Rental Information Commentary"><Textarea val={f.rentalComm} onChange={v => u('rentalComm', v)} rows={2} /></F>
      </div>
    ),

    '23': () => (
      <div>
        <SectionHeader num="23" title="Income Approach" badge={is24Unit ? '2-4 Unit' : 'Income Producing'} />
        <ConditionalBanner text="Income Approach applicable — complete all income and expense fields." />
        <G2>
          <F label="Potential Gross Income ($)" req><Input val={f.potentialGrossIncome} onChange={v => u('potentialGrossIncome', v)} type="number" /></F>
          <F label="Less Vacancy & Collection Loss ($)"><Input val={f.vacancyLoss} onChange={v => u('vacancyLoss', v)} type="number" /></F>
          <F label="Effective Gross Income ($)"><Input val={f.effectiveGrossIncome} onChange={v => u('effectiveGrossIncome', v)} type="number" /></F>
          <F label="Less Operating Expenses ($)"><Input val={f.expenses} onChange={v => u('expenses', v)} type="number" /></F>
          <F label="Net Operating Income ($)"><Input val={f.netOperatingIncome} onChange={v => u('netOperatingIncome', v)} type="number" /></F>
          <F label="Capitalization Rate %"><Input val={f.capRate} onChange={v => u('capRate', v)} type="number" /></F>
          <F label="Gross Rent Multiplier"><Input val={f.grossRentMultiplier} onChange={v => u('grossRentMultiplier', v)} type="number" /></F>
          <F label="Indicated Value by Income Approach ($)"><Input val={f.incomeApproachValue} onChange={v => u('incomeApproachValue', v)} type="number" /></F>
        </G2>
        <F label="Income Approach Commentary"><Textarea val={f.incomeComm} onChange={v => u('incomeComm', v)} rows={2} /></F>
      </div>
    ),

    '24': () => (
      <div>
        <SectionHeader num="24" title="Cost Approach" />
        <G3>
          <F label="Site Value ($)" req><Input val={f.siteValue} onChange={v => u('siteValue', v)} type="number" /></F>
          <F label="Dwelling Value ($)"><Input val={f.dwellingValue} onChange={v => u('dwellingValue', v)} type="number" /></F>
          <F label="Depreciation ($)"><Input val={f.depreciationAmt} onChange={v => u('depreciationAmt', v)} type="number" /></F>
          <F label="Depreciation %"><Input val={f.depreciationPct} onChange={v => u('depreciationPct', v)} type="number" /></F>
          <F label="Improvements As-Is ($)"><Input val={f.improvementsAsIs} onChange={v => u('improvementsAsIs', v)} type="number" /></F>
          <F label="Indicated Value by Cost Approach ($)"><Input val={f.costApproachValue} onChange={v => u('costApproachValue', v)} type="number" /></F>
        </G3>
        <F label="Cost Approach Commentary"><Textarea val={f.costComm} onChange={v => u('costComm', v)} rows={2} /></F>
      </div>
    ),

    '25': () => (
      <div>
        <SectionHeader num="25" title="Disaster Mitigation" badge="Disaster Area" />
        <ConditionalBanner text="Federal disaster area — document all impacts, damage, and mitigation measures." />
        <G2>
          <F label="Disaster Type" req>
            <Sel val={f.disasterType} onChange={v => u('disasterType', v)}
              opts={['Hurricane','Flood','Earthquake','Wildfire','Tornado','Other']} placeholder="Select" />
          </F>
          <F label="FEMA Disaster #"><Input val={f.femaNum} onChange={v => u('femaNum', v)} /></F>
        </G2>
        <F label="Disaster Impact Description" req>
          <Textarea val={f.disasterDesc} onChange={v => u('disasterDesc', v)}
            placeholder="Describe any property damage, mitigation measures completed, and impact on value..." rows={3} />
        </F>
      </div>
    ),

    '26': () => (
      <div>
        <SectionHeader num="26" title="Reconciliation" mandatory />
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <G3>
            <F label="SCA Indicated Value ($)"><Input val={f.scaValue} onChange={v => u('scaValue', v)} type="number" /></F>
            <F label="Cost Approach Value ($)">
              <Input val={f.costApproachValue} onChange={v => u('costApproachValue', v)} type="number"
                cls={!f.showCostApproach ? 'bg-gray-100 text-gray-400' : ''} />
              {!f.showCostApproach && <p className="text-xs text-gray-400 mt-0.5">Cost Approach not included</p>}
            </F>
            <F label="Income Approach Value ($)">
              <Input val={f.incomeApproachValue} onChange={v => u('incomeApproachValue', v)} type="number"
                cls={!showIncomeApproach ? 'bg-gray-100 text-gray-400' : ''} />
              {!showIncomeApproach && <p className="text-xs text-gray-400 mt-0.5">Income Approach not included</p>}
            </F>
          </G3>
        </div>
        <F label="Reconciled Opinion of Market Value ($)" req>
          <input type="number" className="w-full border-2 border-blue-400 rounded px-3 py-2 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={f.reconciledValue || ''} onChange={e => u('reconciledValue', e.target.value)} placeholder="$" />
        </F>
        <G2>
          <F label="Exposure Time"><Input val={f.exposureTime} onChange={v => u('exposureTime', v)} placeholder="e.g., 3-6 months" /></F>
          <F label="Marketing Time"><Input val={f.marketingTimeFinal} onChange={v => u('marketingTimeFinal', v)} placeholder="e.g., 3-6 months" /></F>
        </G2>
        <F label="Reconciliation Commentary" req>
          <Textarea val={f.reconCommentary} onChange={v => u('reconCommentary', v)}
            placeholder="Explain weight given to each approach and support for the final value conclusion..." rows={4} />
        </F>
      </div>
    ),

    '27': () => (
      <div>
        <SectionHeader num="27" title="Supplemental Information" mandatory />
        <F label="Additional Comments">
          <Textarea val={f.suppComments} onChange={v => u('suppComments', v)} rows={5}
            placeholder="Additional commentary, explanation of atypical conditions, clarifications, or any other relevant information not captured in other sections..." />
        </F>
      </div>
    ),

    '28': () => (
      <div>
        <SectionHeader num="28" title="Certification & Scope of Work" mandatory />
        {(isHybrid || isDesktop) && (
          <ConditionalBanner text={`${f.valuationMethod} valuation — inspection scope must reflect the method selected in Assignment Information.`} />
        )}
        <G2>
          <F label="Inspection Type" req>
            <Sel val={f.inspectionType} onChange={v => u('inspectionType', v)}
              opts={['Interior and Exterior','Exterior Only (Drive-By)','Desktop — No Inspection','Hybrid — Third-Party PDC']} />
          </F>
          <F label="Signature Date" req><Input val={f.signatureDate} onChange={v => u('signatureDate', v)} type="date" /></F>
          <F label="Appraiser Name" req><Input val={f.appraiserName} onChange={v => u('appraiserName', v)} /></F>
          <F label="License # / State"><Input val={f.appraiserLicense} onChange={v => u('appraiserLicense', v)} /></F>
          <F label="Supervisory Appraiser (if applicable)"><Input val={f.supervisoryName} onChange={v => u('supervisoryName', v)} /></F>
          <F label="Supervisory License # / State"><Input val={f.supervisoryLicense} onChange={v => u('supervisoryLicense', v)} /></F>
        </G2>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
          <p className="text-xs text-blue-700 font-medium">UAD 3.6 Standard Certification</p>
          <p className="text-xs text-blue-600 mt-1">By completing this report, the appraiser certifies that the statements of fact contained in this report are true and correct, and that the reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions, and are the appraiser's personal, impartial, and unbiased professional analyses, opinions, and conclusions in conformity with USPAP and UAD 3.6.</p>
        </div>
      </div>
    ),
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white text-xs px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      {/* Left Nav */}
      <div className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-3 border-b border-gray-700">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">True Footage</p>
          <p className="text-xs text-gray-400">UAD 3.6 Dynamic URAR</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {sections.map(s => {
            if (!s.show) return null;
            const isActive = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <span className="font-mono text-gray-500 text-xs w-5">{s.id}</span>
                <span className="leading-tight">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="p-3 border-t border-gray-700 text-xs text-gray-500">
          {visible.length} / {sections.length} sections active
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {content[activeSection] ? content[activeSection]() : (
            <div className="text-gray-400 text-sm">Section content coming soon.</div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                const idx = visible.findIndex(s => s.id === activeSection);
                if (idx > 0) setActiveSection(visible[idx - 1].id);
              }}
              disabled={visible.findIndex(s => s.id === activeSection) === 0}
              className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-40">
              ← Previous
            </button>
            <span className="text-xs text-gray-400 self-center">
              {visible.findIndex(s => s.id === activeSection) + 1} of {visible.length}
            </span>
            <button
              onClick={() => {
                const idx = visible.findIndex(s => s.id === activeSection);
                if (idx < visible.length - 1) setActiveSection(visible[idx + 1].id);
              }}
              disabled={visible.findIndex(s => s.id === activeSection) === visible.length - 1}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
