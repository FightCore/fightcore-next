export interface DataTableResponsiveConfig {
  strategy: 'hide-columns' | 'transpose' | 'custom';
  transposeConfig?: {
    labelColumn: string;
    valueColumn: string;
  };

  customMobileRender?: (data: any[]) => React.ReactNode;
}
