import css from './Filters.module.css'
import { useState } from "react";

export default function Filters() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className={css.page}>
    <div className={css.container}>
      <div className={css.window}>
        <div className={css.dashboard}>
          <span className={css.span}>Filters</span>
          <form action="submit" className={css.form} onSubmit={onSubmit}>
            <div className={css.field}>
              <label htmlFor="title" className={css.label}>
                Book title:
              </label>
              <input
                id="title"
                type="text"
                className={`${css.input} ${css.inputTitle}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={css.field}>
              <label htmlFor="author" className={css.label}>
                The author:
              </label>
              <input
                id="author"
                type="text"
                className={`${css.input} ${css.inputAuthor}`}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
                        <div className={css.field}>
              <label htmlFor="pages" className={css.label}>
                Number of pages:
              </label>
              <input
                id="pages"
                type="text"
                className={`${css.input} ${css.inputPages}`}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
            </div>
            <button className={css.button} type="submit" >
              Add book
            </button>
          </form>
        </div> </div> </div>
        </div>)}