import { useState, useMemo, useEffect } from 'react';
import TestRunSearchForm from './TestRunSearchForm';
import TestRunSearchTable from './TestRunSearchTable';

const TestRunReportTabsContentTabOne = () => {
  const [testRunData, setTestRunData] = useState(null);
  const [rowCountState, setRowCountState] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  // live search text from the form
  const [runnameQuery, setRunnameQuery] = useState("");

  // called by the form after Run ID search completes
  const handleSearchSubmit = (data, total_rows, loading) => {
    setTestRunData(data);         // ⚠️ can be array OR an object (normalize below)
    setRowCountState(total_rows ?? 0);
    setLoadingData(loading ?? false);
  };

  // ---- NORMALIZE the server payload into an array of rows
  const rows = useMemo(() => {
    // Common shapes we might receive:
    // 1) Array of rows
    if (Array.isArray(testRunData)) return testRunData;

    // 2) Object with arrays inside
    if (testRunData && typeof testRunData === "object") {
      if (Array.isArray(testRunData.test_runs)) return testRunData.test_runs;
      if (Array.isArray(testRunData.data)) return testRunData.data;
      if (Array.isArray(testRunData.rows)) return testRunData.rows;
    }
    return [];
  }, [testRunData]);

  // ---- FILTER across multiple possible keys (case-insensitive)
  const filteredData = useMemo(() => {
    const q = (runnameQuery || "").trim().toLowerCase();
    if (!q) return rows;

    const pickName = (r) =>
      (r.run_name ??
       r.runName ??
       r.RunName ??
       r.name ??
       r.Run_Name ??
       r['Run Name'] ?? // if backend used a spacey label-like key
       "").toString();

    return rows.filter((r) => pickName(r).toLowerCase().includes(q));
  }, [rows, runnameQuery]);

  // ---- DEBUG: see what's happening
  useEffect(() => {
    console.log("[DEBUG] runnameQuery:", runnameQuery);
  }, [runnameQuery]);

  useEffect(() => {
    console.log("[DEBUG] raw testRunData:", testRunData);
    console.log("[DEBUG] normalized rows length:", rows.length);
    if (rows.length) {
      console.log("[DEBUG] sample row keys:", Object.keys(rows[0] || {}));
      console.log("[DEBUG] sample row:", rows[0]);
    }
  }, [rows, testRunData]);

  return (
    <div>
      <h4>Test Run Search by Run ID / Run Name</h4>

      <TestRunSearchForm
        onSubmit={handleSearchSubmit}      // keep Run ID search
        onRunNameChange={setRunnameQuery}  // wire run-name to client-side filter
      />

      <br />

      {rows.length > 0 && (
        <TestRunSearchTable
          testRunData={filteredData}   // use filtered rows
          rowCount={rowCountState}
          loading={loadingData}
        />
      )}
    </div>
  );
};

export default TestRunReportTabsContentTabOne;
