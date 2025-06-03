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

// TODO: return the real URL from the server
const URL_PREFIX = "http://localhost:8083/"

const ExplorerSearchResult = ({result}) => {
  const handleClick = () => {
    window.open(`${URL_PREFIX}${result.file_key}`, "_blank");
  }

  return (
    <>
      <p className="explorer__search__results__filename" onClick={handleClick} ><i className="material-icons">description</i> {result.filename}</p>
      <p className="explorer__search__results__text">{result.text}</p>
    </>
  )
}

const ExplorerSearchResults = ({results}) => {
  const { t } = useTranslation();
  return (
    <div className="explorer__content">
      <p className="explorer__search__results__title"><i className="material-icons">plagiarism</i> {t("explorer.search.results")}</p>
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