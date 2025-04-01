import {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./styles.css";
import {
  ClientSideRowModelModule, ColDef,
  ColumnAutoSizeModule,
  ModuleRegistry, SizeColumnsToFitGridStrategy,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", width: 150, suppressSizeToFit: true },
    { field: "age", width: 50 },
    { colId: "country", field: "country", maxWidth: 300 },
    { field: "year", width: 90 },
    { field: "sport", width: 110 },
    { field: "gold", width: 100 },
  ]);
  const autoSizeStrategy: SizeColumnsToFitGridStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
      defaultMinWidth: 100,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/small-olympic-winners.json",
    4000
  );

  const sizeToFit = useCallback(() => {
    gridRef.current.api.sizeColumnsToFit({
      defaultMinWidth: 100,
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="outer-div">
        <div className="button-bar">
          <button onClick={sizeToFit}>Resize Columns to Fit Grid Width</button>
        </div>
        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={data}
              loading={loading}
              columnDefs={columnDefs}
              autoSizeStrategy={autoSizeStrategy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>
);