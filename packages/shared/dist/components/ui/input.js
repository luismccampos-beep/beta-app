import "../../chunk-3TW2EZWB.js";
import "../../chunk-RP6JGCEK.js";
import {
  cn
} from "../../chunk-CDRKFMWH.js";
import "../../chunk-TP5M5ICF.js";
import "../../chunk-QYGYBXGO.js";
import "../../chunk-FQY4JAKU.js";

// src/components/ui/input.tsx
import React from "react";
var Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
export {
  Input
};
//# sourceMappingURL=input.js.map