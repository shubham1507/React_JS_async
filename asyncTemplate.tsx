import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Grid, TextField /*, Alert, Stack */ } from "@mui/material";

const TestRunSearchForm = ({ onSubmit, onRunNameChange }) => {
  // Keep your RHF setup intact
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      testRunId: "",
      runname: "", // <- already present in your code
    },
  });

  // ✅ ADD: watch runname so we can emit live changes to the parent
  const runname = watch("runname");

  // ✅ ADD: debounce the emission to avoid re-rendering the table on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      // Parent will use this value to filter rows; no API call is made here
      onRunNameChange?.((runname || "").trim());
    }, 200);
    return () => clearTimeout(t);
  }, [runname, onRunNameChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* -------- Test Run ID (UNCHANGED: used for server-side search) -------- */}
        <Grid item xs={12} md={2}>
          <Controller
            name="testRunId"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                label="Test Run ID"
                variant="outlined"
                fullWidth
                {...field}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error ? fieldState.error.message : null}
              />
            )}
          />
        </Grid>

        {/* -------- Run Name (USED FOR CLIENT-SIDE FILTERING) -------- */}
        <Grid item xs={12} md={2}>
          <Controller
            name="runname"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <TextField
                label="Run Name"
                placeholder="Search by run name…"
                variant="outlined"
                fullWidth
                {...field}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error ? fieldState.error.message : null}
              />
            )}
          />
        </Grid>

        {/* -------- Submit button (UNCHANGED) -------- */}
        <Grid item xs={12} md={6}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // disabled={loading} // keep if you already have loading state
          >
            {/* {loading ? "Searching..." : "Search"} */}
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Optional: keep your error banner if you already had one */}
      {/* {errorMsg && (
        <Stack sx={{ mt: 3, minHeight: "100vh" }}>
          <Alert severity="error">{errorMsg}</Alert>
        </Stack>
      )} */}
    </form>
  );
};

export default TestRunSearchForm;
