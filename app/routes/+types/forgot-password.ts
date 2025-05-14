import type { MetaFunction } from "react-router-dom";

export namespace Route {
  export interface MetaArgs {
    params: Record<string, string>;
  }
  
  export const meta: MetaFunction = ({ params }) => {
    return [
      { title: "استعادة كلمة المرور - كرييتيف" },
      { name: "description", content: "استعادة كلمة المرور لحسابك في كرييتيف" },
    ];
  };
} 