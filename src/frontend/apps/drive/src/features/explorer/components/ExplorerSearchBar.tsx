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
    <>
      <p className="explorer__search__results__filename"><span className="material-icons">description</span> {result.filename}</p>
      <p className="explorer__search__results__text">{result.text}</p>
    </>
  )
}

const ExplorerSearchResults = ({results}) => {
  const { t } = useTranslation();
  return (
    <div className="explorer__content">
      <p className="explorer__search__results__title"><span className="material-icons">plagiarism</span> {t("explorer.search.results")}</p>
      {results.map((result, idx) => (
        <ExplorerSearchResult result={result} key={`search-result-${idx}`}/>
      ))}
    </div>
  )
}

export const ExplorerSearchBar = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const form = useForm<Inputs>();


  const onSubmit: SubmitHandler<Inputs> = async (search_query) => {
    // form.reset();

    async function fetchData(search_query: string) {
      const response = await fetchAPI(`items/search/`, {params: {title: search_query}})
      const data = await response.json()

      return data.results
    }

    fetchData(search_query.search_query).then(data => {
      console.log(data)
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
          <div className="explorer__search__container">
            <RhfInput
              label={t("explorer.tree.search")}
              // fullWidth={true}
              autoFocus={true}
              {...form.register("search_query")}
              className="explorer__search__input"
            />
            <ExplorerSearchButton />
          </div>
        </form>
      </FormProvider>
      {results.length > 0 && <ExplorerSearchResults results={results}/>}
    </>
  )
};