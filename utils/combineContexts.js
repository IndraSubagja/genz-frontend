export default function combineContexts(...components) {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) =>
      function CombinedContexts({ children }) {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      }
  );
}
