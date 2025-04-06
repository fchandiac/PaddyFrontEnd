export const formatNumericColumns = (columns: any[]) =>
    columns.map((col) => {
      if (col.type === 'number' && !col.valueFormatter) {
        return {
          ...col,
          valueFormatter: (params: any) =>
            typeof params.value === 'number' ? params.value.toString() : params.value,
        };
      }
      return col;
    });