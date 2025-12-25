import css from "./Recommended.module.css";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon/Icon";

export default function Recommended() {
  return (
    <div className={css.container}>
      <div className={css.window}>
        <div className={css.dashboard}>
          <span className={css.span}>Filters</span>
          <form action="submit" className={css.form}>
            <div className={css.field}>
              <label htmlFor="title" className={css.label}>
                Book title:
              </label>
              <input
                id="title"
                type="text"
                className={`${css.input} ${css.inputTitle}`}
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
              />
            </div>
            <button className={css.button} type="submit">
              To apply
            </button>
          </form>
        </div>
        <div className={css.workout}>
          <p className={css.title}>Start your workout</p>
          <ul className={css.steps}>
            <li className={css.step}>
              <div className={css.circle}>1</div>
              <p className={css.text}>
                {" "}
                <span className={css.text_span}>
                  Create a personal library:
                </span>{" "}
                add the books you intend to read to it.
              </p>
            </li>
            <li className={css.step}>
              <div className={css.circle}>2</div>
              <p className={css.text}>
                {" "}
                <span className={css.text_span}>
                  Create your first workout:
                </span>{" "}
                define a goal, choose a period, start training.
              </p>
            </li>
          </ul>
          <div className={css.under}>
            <Link to="/library" className={css.link}>
              My library
            </Link>
            <Link to="/library">
              {" "}
              <Icon name="login" width={24} height={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
