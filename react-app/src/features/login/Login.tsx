import React from 'react'
import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Login.module.css";
import {
    editUserName,
    editPassword,
    toggleMode,
    fetchAsyncLogin,
    fetchAsyncRegister,
    selectAuthen,
    selectIsLoginView,
} from "./loginSlice";

const Login = () => {
    const dispatch = useDispatch();
    const authen = useSelector(selectAuthen);
    const isLoginView = useSelector(selectIsLoginView);
    const btnDisabler = authen.username === "" || authen.password === "";

    const login = async () => {
        if (isLoginView) {
            await dispatch(fetchAsyncLogin(authen));
        } else {
            const result: any = await dispatch(fetchAsyncRegister(authen));

            if (fetchAsyncRegister.fulfilled.match(result)) {
                await dispatch(fetchAsyncLogin(authen));
            }
        }
    }

    return (
        <div className={styles.containerLogin}>
            <div className={styles.appLogin}>
                <h1>{isLoginView ? "Login" : "Register"}</h1>
                <span>UserName</span>
                <input
                    type="text"
                    className={styles.inputLog}
                    name="username"
                    placeholder=""
                    onChange={(e) => dispatch(editUserName(e.target.value))}
                />
                <span>Password</span>
                <input
                    type="password"
                    className={styles.inputLog}
                    name="password"
                    placeholder=""
                    onChange={(e) => dispatch(editPassword(e.target.value))}
                />
                <div className={styles.switch}>
                    <Button
                        variant="contained"
                        disabled={btnDisabler}
                        color="primary"
                        onClick={login}
                    >
                        {isLoginView ? "Login" : "Create"}
                    </Button>
                </div>
                <span
                    className={styles.switchText}
                    onClick={() => dispatch(toggleMode())}
                >
                    {isLoginView ? "Create Account ?" : "Back to Login"}
                </span>
            </div>
        </div>
    )
}

export default Login
