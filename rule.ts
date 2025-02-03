export type ClickRule = {
  // identifiers
  type: "click-rule";
  id: string;

  // metadata
  description: string;

  // matchers
  cssPath: string;
  route: string;
};

export type RulesDoc = {
  version: string;
  id: string;

  // http buffer
  // bufferSize: number;
  // bufferSkips: string[];

  // rules
  rules: ClickRule[];
};
