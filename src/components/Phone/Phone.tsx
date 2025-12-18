import css from './Phone.module.css';

export default function Phone() {
    return (
        <div className={css.container}>
            <div className={css.window}>
            <img src="../../../public/img/phone.png" alt="" width={255} height={518} />
            </div>
        </div>
    )
}