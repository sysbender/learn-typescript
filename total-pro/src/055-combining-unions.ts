import { Equal, Expect } from "@total-typescript/helpers";

type HttpCode = HttpErrorCase | HttpSuccessCase;
type HttpSuccessCase = "200" | "201" | "204";
type HttpErrorCase = "400" | "401" | "404" | "500";

const handleErrorCase = (code: HttpErrorCase) => {
  type test = Expect<Equal<typeof code, HttpErrorCase>>;
};

const handleSuccessCase = (code: HttpSuccessCase) => {
  type test = Expect<Equal<typeof code, HttpSuccessCase>>;
};

const handleAllCase = (code: HttpCode) => {
  type test = Expect<Equal<typeof code, HttpCode>>;
};
