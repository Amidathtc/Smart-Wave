// src/flutterwave.ts
import Flutterwave from "flutterwave-node";

const flw = new Flutterwave(
  "FLWPUBK_TEST-77aaaf1a9c574ab0152bc26c3adbd9fa-X",
  "FLWSECK_TEST-19f82b8deca6eea44606cbd91b6d431b-X",
  true
);

export { flw };
