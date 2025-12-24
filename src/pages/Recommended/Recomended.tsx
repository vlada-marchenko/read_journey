import css from './Recommended.module.css'
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';

export default function Recommended() {
    return (
        <div className={css.container}>
            <div className={css.dashboard}>
                <span className={css.label}>Filters</span>
                <input type="text" placeholder='Book title:' className={css.input}/>
                <input type="text" placeholder='The author:' className={css.input}/>
                <button className={css.button}>To apply</button>
            </div>
            <div className={css.workout}>
                <p className={css.title}>Start your workout</p>
                <ul className={css.steps}>
                    <li className={css.step}>
                        <div className={css.circle}>1</div>
                        <p className={css.text}> <span className={css.text_span}>Create a personal library:</span> add the books you intend to read 
to it.</p>
                        </li>
                        <li className={css.step}>
                                                    <div className={css.circle}>2</div> 
                        <p className={css.text}> <span className={css.text_span}>Create your first workout:</span> define a goal, choose a period, start training.</p>
                        </li>
                </ul>
                <div className={css.under}>
                    <Link to='/library'>My library</Link>
                    <Icon name='arrow'/>
                </div>
            </div>
        </div>
    );
}