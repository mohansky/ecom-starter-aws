   Creating an optimized production build ...
 ✓ Compiled successfully in 49s

./src/components/CategoryPieChart.tsx
59:9  Warning: The 'getDateRange' function makes the dependencies of useMemo Hook (at line 139) change on every render. Move it inside the useMemo callback. Alternatively, wrap the definition of 'getDateRange' in its own useCallback() Hook.  react-hooks/exhaustive-deps

./src/components/DataTable/Columns/CategoriesColumn.tsx
69:48  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
96:46  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
99:11  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

./src/components/ProductsPieChart.tsx
139:6  Warning: React Hook useMemo has an unnecessary dependency: 'dateRange'. Either exclude it or remove the dependency array.  react-hooks/exhaustive-deps

./src/components/SalesChart.tsx
40:9  Warning: The 'getDateRange' function makes the dependencies of useMemo Hook (at line 99) change on every render. Move it inside the useMemo callback. Alternatively, wrap the definition of 'getDateRange' in its own useCallback() Hook.  react-hooks/exhaustive-deps
