const sheetId = '1rBsGl0vcDxE7n33Pi_F6RVSymG6pFcYL1re5jrGPmRk';

async function run() {
  // The Bordeaux tab gid is 225116107
  // Try export with gid
  const gid = '225116107';
  
  // Method 1: export endpoint with gid + range
  const url1 = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&range=G1:H5`;
  const res1 = await fetch(url1, { redirect: 'follow' });
  console.log('Method 1 (export gid+range) status:', res1.status);
  if (res1.status === 200) {
    const txt1 = await res1.text();
    if (!txt1.includes('<!DOCTYPE')) console.log('Result:', txt1);
    else console.log('Got HTML page (not CSV)');
  }
  
  // Method 2: gviz with range parameter
  const tabName = encodeURIComponent('🟥  Bordeaux - 5 &  6 sept');
  const url2 = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${tabName}&range=G1:H5`;
  const res2 = await fetch(url2);
  console.log('\nMethod 2 (gviz+range) status:', res2.status);
  const txt2 = await res2.text();
  console.log('Result:', txt2);
  
  // Method 3: gviz with JSON output to see cell types
  const url3 = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${tabName}&tq=${encodeURIComponent('SELECT G,H LIMIT 5')}`;
  const res3 = await fetch(url3);
  const txt3 = await res3.text();
  // Strip JSONP wrapper
  const jsonStr = txt3.replace(/^[^{]+/, '').replace(/[^}]+$/, '');
  try {
    const json = JSON.parse(jsonStr);
    console.log('\nMethod 3 (gviz JSON):');
    console.log('Cols:', json.table.cols.map(c => c.label));
    json.table.rows.forEach((r, i) => {
      console.log('Row', i, ':', r.c.map(c => c ? c.v : null));
    });
  } catch(e) {
    console.log('JSON parse error. Raw:', txt3.substring(0, 500));
  }
}

run();
