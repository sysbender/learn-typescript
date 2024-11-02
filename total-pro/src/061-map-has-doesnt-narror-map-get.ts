type Event = {
  message: string;
};

const processUserMap = (eventMap: Map<string, Event>) => {
  // map does not track has = get
  const newLocal = eventMap.get("error");
  if (newLocal) {
    const message = newLocal.message;

    throw new Error(message);
  }
};
