
import * as yup from "yup";
import css from "./Login.module.css";
import type { LoginData } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import type { FormikHelpers } from "formik";
import { Formik, Field, ErrorMessage, Form } from "formik";
import Icon from "../../components/Icon/Icon";
import { useState } from "react";
import Phone from "../../components/Phone/Phone";

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(emailRegex, "Email is not valid"),
  password: yup
    .string()
    .min(7, "Password must be at least 7 characters")
    .required("Password is required"),
});

export function Login() {
  const navigate = useNavigate();
  const { login: doLogin } = useAuth();
  const [isHashed, setIsHashed] = useState(true);

  const initialValues: LoginData = {
    email: "",
    password: ""
  };

  const onSubmit = async (
    { email, password }: LoginData,
    helpers: FormikHelpers<LoginData>
  ) => {
    try {
      await doLogin({ email, password });
      navigate("/recommended", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      helpers.setSubmitting(false);
    }
  };
  return (
    <div className={css.container}>
        <div className={css.window}>
      <Icon name="logo" className={css.icon} width={182} height={17} />
      <Icon name="logo-mob" className={css.icon_mob} width={42} height={17} />
      <h1 className={css.title}>
        Expand your mind, reading <span className={css.title_span}>a book</span>
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
        validateOnBlur
        validateOnChange
      >
        {({ isSubmitting, errors, touched }) => {
          const passError = touched.password && !!errors.password;
          const passSuccess = touched.password && !errors.password;
          return (
            <Form className={css.form}>
              <div className={css.field}>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  className={`${css.input} ${css.inputEmail}`}
                />
                <label htmlFor="email" className={css.label}>
                  Mail:
                </label>
                <ErrorMessage
                  name="email"
                  component="span"
                  className={css.error}
                />
              </div>
              <div className={css.field}>
                <Field
                  id="password"
                  name="password"
                  type={isHashed ? "password" : "text"}
                  placeholder=" "
                  className={[
                    css.input,
                    css.inputPassword,
                    passError ? css.inputError : "",
                    passSuccess ? css.inputSuccess : "",
                  ].join(" ")}
                />

                <label htmlFor="password" className={css.label}>
                  Password:
                </label>

                {passError && (
                  <Icon
                    name="error"
                    className={css.statusIcon}
                    width={20}
                    height={20}
                  />
                )}
                {passSuccess && (
                  <Icon
                    name="check"
                    className={css.statusIcon}
                    width={20}
                    height={20}
                  />
                )}

                <button
                  type="button"
                  className={[
                    css.password_toggle,
                    passError || passSuccess ? css.eyeHidden : "",
                  ].join(" ")}
                  onClick={() => setIsHashed((prev) => !prev)}
                >
                  <Icon
                    name={isHashed ? "eye-off" : "eye"}
                    width={20}
                    height={20}
                  />
                </button>

                <ErrorMessage
                  name="password"
                  component="span"
                  className={css.error}
                />
              </div>

              <div className={css.buttons}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={css.button}
                >
                  Log in
                </button>
                <a className={css.link} href="/register">
                  Don't have an account?
                </a>
              </div>
            </Form>
          );
        }}
      </Formik>
      </div>
      <div className={css.phone}>
        <Phone />
      </div>
    </div>
  );
}
