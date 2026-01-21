import { Link } from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import { RecommendedBooks } from "../../components/RecommendedBooks/RecommendedBooks";
export { Link } from "react-router-dom";
import css from "./Library.module.css";

export default function Library() {
    return <div className={css.container}>
        <div className={css.window}>
            <div className={css.recommended}>
    <RecommendedBooks showPagination={true} fixedCount={3} variant="library" footer={
        <div className={css.footer}>
        <Link className={css.link} to="/recommended">Home</Link>
        <Icon className={css.icon} name="login" width={20} height={20}/>
        </div>
    }/>
    </div>
    </div>
    </div>
}