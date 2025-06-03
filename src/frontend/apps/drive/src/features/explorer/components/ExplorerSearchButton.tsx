import { Button } from "@openfun/cunningham-react";
import { useTranslation } from "react-i18next";
export const ExplorerSearchButton = () => {
  const { t } = useTranslation();
  return (
    <>
      <Button
        color="primary-text"
        aria-label={t("explorer.tree.search")}
        icon={<span className="material-icons">search</span>}
        className="explorer__search__button"
      />
    </>
  );
};
