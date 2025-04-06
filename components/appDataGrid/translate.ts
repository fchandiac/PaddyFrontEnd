
const esESGrid = {
  // Root
  noRowsLabel: "Sin filas",
  noResultsOverlayLabel: "Ningún resultado encontrado.",
  errorOverlayDefaultLabel: "Ha ocurrido un error.",

  // Density selector toolbar button text
  toolbarDensity: "Densidad",
  toolbarDensityLabel: "Densidad",
  toolbarDensityCompact: "Compacta",
  toolbarDensityStandard: "Standard",
  toolbarDensityComfortable: "Comoda",

  // Columns selector toolbar button text
  toolbarColumns: "Columnas",
  toolbarColumnsLabel: "Seleccionar columnas",

  // Filters toolbar button text
  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count: number) =>
    count > 1 ? `${count} filtros activos` : `${count} filtro activo`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "Buscar...",
  toolbarQuickFilterLabel: "Buscar",

  // Export selector toolbar button text
  toolbarExport: "Exportar",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar como CSV",

  // Columns panel text
  columnsPanelTextFieldLabel: "Columna de búsqueda",
  columnsPanelTextFieldPlaceholder: "Título de columna",
  columnsPanelDragIconLabel: "Reordenar columna",
  columnsPanelShowAllButton: "Mostrar todo",
  columnsPanelHideAllButton: "Ocultar todo",

  // Filter panel text
  filterPanelAddFilter: "Agregar filtro",
  filterPanelDeleteIconLabel: "Borrar",
  filterPanelOperators: "Operadores",
  filterPanelOperatorAnd: "Y",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Columnas",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Valor de filtro",

  // Filter operators text
  filterOperatorContains: "contiene",
  filterOperatorEquals: "es igual",
  filterOperatorStartsWith: "comienza con",
  filterOperatorEndsWith: "termina con",
  filterOperatorIs: "es",
  filterOperatorNot: "no es",
  filterOperatorAfter: "es posterior",
  filterOperatorOnOrAfter: "es en o posterior",
  filterOperatorBefore: "es anterior",
  filterOperatorOnOrBefore: "es en o anterior",
  filterOperatorIsEmpty: "está vacío",
  filterOperatorIsNotEmpty: "no está vacío",
  filterOperatorIsAnyOf: "es cualquiera de",

  // Filter values text
  filterValueAny: "cualquiera",
  filterValueTrue: "verdadero",
  filterValueFalse: "falso",

  // Column menu text
  columnMenuLabel: "Menú",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuFilter: "Filtro",
  columnMenuHideColumn: "Ocultar",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Ordenar asc",
  columnMenuSortDesc: "Ordenar desc",

  // Column header text
  columnHeaderFiltersTooltipActive: (count: number) =>
    count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: "Mostrar filtros",
  columnHeaderSortIconLabel: "Ordenar",

  // Rows selected footer text
  footerRowSelected: (count: number) =>
    count > 1
      ? `${count} filas seleccionadas`
      : `${count} fila seleccionada`,

  // Total row amount footer text
  footerTotalRows: "Filas Totales:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (
    visibleCount: { toLocaleString: () => any },
    totalCount: { toLocaleString: () => any }
  ) => `${visibleCount} de ${totalCount}`,

  // Boolean cell text
  booleanCellTrueLabel: "Sí",
  booleanCellFalseLabel: "No",

  // Actions cell more text
  actionsCellMore: "más",
};

export default esESGrid;






// const esESGrid = {
//     // Root
//     noRowsLabel: "Sin filas",
//     noResultsOverlayLabel: "Ningún resultado encontrado.",
//     errorOverlayDefaultLabel: "Ha ocurrido un error.",
//     // Density selector toolbar button text
//     toolbarDensity: "Densidad",
//     toolbarDensityLabel: "Densidad",
//     toolbarDensityCompact: "Compacta",
//     toolbarDensityStandard: "Standard",
//     toolbarDensityComfortable: "Comoda",
//     // Columns selector toolbar button text
//     toolbarColumns: "Columnas",
//     toolbarColumnsLabel: "Seleccionar columnas",
//     // Filters toolbar button text
//     toolbarFilters: "Filtros",
//     toolbarFiltersLabel: "Mostrar filtros",
//     toolbarFiltersTooltipHide: "Ocultar filtros",
//     toolbarFiltersTooltipShow: "Mostrar filtros",
//     toolbarFiltersTooltipActive: (count: number) =>
//       count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
//     // Quick filter toolbar field
//     toolbarQuickFilterPlaceholder: "Buscar...",
//     toolbarQuickFilterLabel: "Buscar",
//     // toolbarQuickFilterDeleteIconLabel: 'Clear',
//     // Export selector toolbar button text
//     toolbarExport: "Exportar",
//     toolbarExportLabel: "Exportar",
//     toolbarExportCSV: "Descargar como CSV",
//     // toolbarExportPrint: 'Print',
//     // toolbarExportExcel: 'Download as Excel',
//     // Columns panel text
//     columnsPanelTextFieldLabel: "Columna de búsqueda",
//     columnsPanelTextFieldPlaceholder: "Título de columna",
//     columnsPanelDragIconLabel: "Reorder columna",
//     columnsPanelShowAllButton: "Mostrar todo",
//     columnsPanelHideAllButton: "Ocultar todo",
//     // Filter panel text
//     filterPanelAddFilter: "Agregar filtro",
//     filterPanelDeleteIconLabel: "Borrar",
//     // filterPanelLinkOperator: 'Logic operator',
//     filterPanelOperators: "Operadores",
//     // TODO v6: rename to filterPanelOperator
//     filterPanelOperatorAnd: "Y",
//     filterPanelOperatorOr: "O",
//     filterPanelColumns: "Columnas",
//     filterPanelInputLabel: "Valor",
//     filterPanelInputPlaceholder: "Valor de filtro",
//     // Filter operators text
//     filterOperatorContains: "contiene",
//     filterOperatorEquals: "es igual",
//     filterOperatorStartsWith: "comienza con",
//     filterOperatorEndsWith: "termina con",
//     filterOperatorIs: "es",
//     filterOperatorNot: "no es",
//     filterOperatorAfter: "es posterior",
//     filterOperatorOnOrAfter: "es en o posterior",
//     filterOperatorBefore: "es anterior",
//     filterOperatorOnOrBefore: "es en o anterior",
//     filterOperatorIsEmpty: "está vacío",
//     filterOperatorIsNotEmpty: "no esta vacío",
//     filterOperatorIsAnyOf: "es cualquiera de",
//     // Filter values text
//     filterValueAny: "cualquiera",
//     filterValueTrue: "verdadero",
//     filterValueFalse: "falso",
//     // Column menu text
//     columnMenuLabel: "Menú",
//     columnMenuShowColumns: "Mostrar columnas",
//     columnMenuFilter: "Filtro",
//     columnMenuHideColumn: "Ocultar",
//     columnMenuUnsort: "Desordenar",
//     columnMenuSortAsc: "Ordenar asc",
//     columnMenuSortDesc: "Ordenar desc",
//     // Column header text
//     columnHeaderFiltersTooltipActive: (count: number) =>
//       count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
//     columnHeaderFiltersLabel: "Mostrar filtros",
//     columnHeaderSortIconLabel: "Ordenar",
//     // Rows selected footer text
//     footerRowSelected: (count: number) =>
//       count > 1
//         ? `${count.toLocaleString()} filas seleccionadas`
//         : `${count.toLocaleString()} fila seleccionada`,
//     // Total row amount footer text
//     footerTotalRows: "Filas Totales:",
//     // Total visible row amount footer text
//     footerTotalVisibleRows: (
//       visibleCount: { toLocaleString: () => any },
//       totalCount: { toLocaleString: () => any }
//     ) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
//     // Checkbox selection text
//     // checkboxSelectionHeaderName: 'Checkbox selection',
//     // checkboxSelectionSelectAllRows: 'Select all rows',
//     // checkboxSelectionUnselectAllRows: 'Unselect all rows',
//     // checkboxSelectionSelectRow: 'Select row',
//     // checkboxSelectionUnselectRow: 'Unselect row',
//     // Boolean cell text
//     booleanCellTrueLabel: "Si",
//     booleanCellFalseLabel: "No",
//     // Actions cell more text
//     actionsCellMore: "más", // Column pinning text
//     // pinToLeft: 'Pin to left',
//     // pinToRight: 'Pin to right',
//     // unpin: 'Unpin',
//     // Tree Data
//     // treeDataGroupingHeaderName: 'Group',
//     // treeDataExpand: 'see children',
//     // treeDataCollapse: 'hide children',
//     // Grouping columns
//     // groupingColumnHeaderName: 'Group',
//     // groupColumn: name => `Group by ${name}`,
//     // unGroupColumn: name => `Stop grouping by ${name}`,
//     // Master/detail
//     // detailPanelToggle: 'Detail panel toggle',
//     // expandDetailPanel: 'Expand',
//     // collapseDetailPanel: 'Collapse',
//     // Row reordering text
//     // rowReorderingHeaderName: 'Row reordering',
//   };




