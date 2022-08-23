import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import {useTheme} from 'next-themes';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../assets/wikitechtreelogo.png';
import UAuth from '@uauth/js';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Button from '@mui/material/Button';

const uauth = new UAuth(
    {
        clientID: "b189a98b-1315-4e43-b243-87f1b26f3765",
        redirectUri: "https://techtreewiki.com/",
        scope: "openid wallet"
    })

export default class Header extends React.Component {
    state = {
        theme: 'dark',
        user: undefined
    }

   componentDidMount() {
        var unse = window.localStorage.username
        if (unse) {
          var user = JSON.parse(unse)
          this.setState({uns: user.value});
        }
    }

    doLogin = async () => {
        try {
            const authorization = await uauth.loginWithPopup();

            console.log(authorization);
            window.location.reload()
        } catch (error) {
            console.error(error);
        }
    }

    logout() {
        window.localStorage.removeItem('username')
        window.location.reload()
    }

    render() {
        return (
            <header class="grid grid-cols-3">

                <div>
                    {this.state.uns 
                    ?
                        <Button sx={{
                            color: 'white'
            
                        }}
                        onClick={() => this.logout()}>
                            {this.state.uns}
                        </Button>
                    :
                        <Button sx={{
                            color: 'white'
                        }}
                        onClick={() => this.doLogin()}>
                            <AccountBalanceWalletIcon />
                        </Button>
                    }
                </div>

                    <div className={utilStyles.top}>
                        <Link href="/">
                            <Image src={Logo} height={50} width={50} />
                        </Link>
                    </div>

                    <div className={utilStyles.topRight}>
                        <IconButton  onClick={() => this.setState({theme: (this.state.theme === 'dark' ? 'light' : 'dark')})} color="inherit" >
                            {this.state.theme === 'dark' ? <LightModeIcon className={utilStyles.topRight} /> : <NightlightRoundIcon className={utilStyles.topRight} />}
                        </IconButton>
                    </div>

            </header>
        )
    }
}