import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import {useTheme} from 'next-themes'
import IconButton from '@mui/material/IconButton';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';
import Link from 'next/link';

export default function Header() {
    const {theme, setTheme} = useTheme();

    return (
        <header className={styles.header}>

            <div className={styles.subHeader} class="grid grid-cols-3">

                <div></div>

                <Link href="/">
                <a className={utilStyles.heading2Xl}>TechTreeWiki</a>
                </Link>

                <IconButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} color="inherit" >
                    {theme === 'dark' ? <LightModeIcon /> : <NightlightRoundIcon />}
                </IconButton>

            </div>

        </header>
    )
}