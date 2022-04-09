import generateID from "./TagGenerator";

it("Tests the tag generator", () => {
  const id = generateID();

  expect(id.length).toBe(8);
});
