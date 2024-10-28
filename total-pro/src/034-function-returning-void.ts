type ListenerFunc = () => void;
const addClickEventListener = (listener: ListenerFunc) => {
  document.addEventListener("click", listener);
};

addClickEventListener(() => {
  console.log("clicked!");
});

addClickEventListener(
  // @ts-expect-error
  "abc"
);
