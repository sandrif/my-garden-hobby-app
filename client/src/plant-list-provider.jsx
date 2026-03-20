import React from 'react';
import { createContext, useState,  useEffect } from "react";

import FetchHelper from "./fetch-helper.js";

export const PlantListContext = createContext();

function PlantListProvider({ children }) {
//TODO 
  const [plantName, setPlantName] = useState();

  const [plantListDto, setPlantListDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
  });

  const [collectionPlants, setCollectionPlants] = useState([]);

  async function handleLoad() {
    setPlantListDto((current) => {
      return { ...current, data: undefined, state: "pending" };
    });
    const result = await FetchHelper.plant.list({ name: plantName });

    setPlantListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

   /* eslint-disable */
   useEffect(() => {
    handleLoad();
  }, [plantName]);
  /* eslint-enable */

  async function handleLoadListByCollectionId() {
    setPlantListDto((current) => {
      return { ...current, data: undefined, state: "pending" };
    });
    const result = await FetchHelper.collection.listByCollectionId({ collectionId: collectionPlants });

    setPlantListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  // useEffect(() => {
  //   console.log("Triggering collection load for:", collectionPlants);
  //   if (collectionPlants) {
  //     handleLoadListByCollectionId();
  //   }
  // }, [collectionPlants]);


  async function handleCreate(dtoIn) {
    setPlantListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.plant.create(dtoIn);
    setPlantListDto((current) => {
      if (result.ok) {
        const updatedData = current.data || { itemList: [] };
        updatedData.itemList.push(result.data);
        return {
          ...current,
          state: "ready",
          data: { ...updatedData, itemList: updatedData.itemList.slice() },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleUpdate(dtoIn) {
    setPlantListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.plant.update(dtoIn);
    setPlantListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
          (item) => item.id === dtoIn.id
        );
        current.data.itemList[itemIndex] = dtoIn;
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
          pendingId: undefined,
        };
      } else {
        return {
          ...current,
          state: "error",
          error: result.data,
          pendingId: undefined,
        };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }



  const value = {
    ...plantListDto,
    plantName, 
    setPlantName,collectionPlants, setCollectionPlants,
    handlerMap: { handleLoad, handleLoadListByCollectionId, handleCreate, handleUpdate },
  };

  return (
    <PlantListContext.Provider value={value}>
      {children}
    </PlantListContext.Provider>
  );
}

export default PlantListProvider;