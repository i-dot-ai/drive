// import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { RhfInput } from "@/features/forms/components/RhfInput";
import { fetchAPI } from "@/features/api/fetchApi";
import { ExplorerSearchButton } from "./ExplorerSearchButton"
import {useTranslation} from "react-i18next";

type Inputs = {
  search_query: string;
}

const ExplorerSearchResult = ({result}) => {
  return (
    <p>{result.title}</p>
  )
}

const ExplorerSearchResults = ({results}) => {
  const { t } = useTranslation();
  return (
    <div>
      <p>{t("explorer.search.results")}</p>
      {results.map(result => (
        <ExplorerSearchResult result={result} key={result.id}/>
      ))}
    </div>
  )
}

export const ExplorerSearchBar = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const form = useForm<Inputs>();


  const onSubmit: SubmitHandler<Inputs> = async (search_query) => {
    form.reset();

    async function fetchData(search_query: string) {
      const response = await fetchAPI(`items/search/`, {params: {title: search_query}})
      const data = await response.json()

      return data.results
    }

    fetchData(search_query.search_query).then(data => {
      setResults(data)
    })


  }

  return (
    <>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="search-form"
        >
          <div>
            <RhfInput
              label={t("explorer.tree.search")}
              // fullWidth={true}
              autoFocus={true}
              {...form.register("search_query")}
            />
            <ExplorerSearchButton />
          </div>
        </form>
      </FormProvider>
      {results.length > 0 && <ExplorerSearchResults results={results}/>}
    </>
  )
};