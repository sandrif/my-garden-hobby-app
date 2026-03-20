async function Call(baseUri, useCase, dtoIn, method) {
  
    let response;
    if (!method || method === "get") {

      console.log("POST", `${baseUri}/${useCase}`, dtoIn);
      response = await fetch(
        `${baseUri}/${useCase}${
          dtoIn && Object.keys(dtoIn).length
            ? `?${new URLSearchParams(dtoIn)}`
            : ""
        }`
      );
    } else {
      console.log("POST", `${baseUri}/${useCase}`, dtoIn);
      response = await fetch(`${baseUri}/${useCase}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoIn),
      });
    }
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  }
  
  const baseUri = "http://localhost:3000";
  
  const FetchHelper = {
    plant: {
      get: async (dtoIn) => {
        return await Call(baseUri, "plant/get", dtoIn, "get");
      },
      create: async (dtoIn) => {
        return await Call(baseUri, "plant/create", dtoIn, "post");
      },
      update: async (dtoIn) => {
        return await Call(baseUri, "plant/update", dtoIn, "post");
      },
      list: async (dtoIn) => {
        return await Call(baseUri, "plant/list", dtoIn, "get");
      },
      listByCollectionId: async (dtoIn) => {
        return await Call(baseUri, "plant/listByCollectionId", dtoIn, "get");
      }
      
    },
  
    collection: {
      get: async (dtoIn) => {
        return await Call(baseUri, "collection/get", dtoIn, "get");
      },
      list: async () => {
        return await Call(baseUri, "collection/list", null, "get");
      },
    },
  };
  
  export default FetchHelper;