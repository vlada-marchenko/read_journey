import * as yup from "yup";
import css from "./Registration.module.css";
import type { RegisterData } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import type { FormikHelpers } from "formik";
import { Formik, Field, ErrorMessage, Form } from "formik";
import Icon from "../../components/Icon/Icon";
import { useState } from "react";
import Phone from "../../components/Phone/Phone";
import { Link } from "react-router-dom";

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const schema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
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

export function Registration() {
  const navigate = useNavigate();
  const { register: doRegister } = useAuth();
  const [isHashed, setIsHashed] = useState(true);

  const initialValues: RegisterData = {
    name: "",
    email: "",
    password: "",
  };

  const onSubmit = async (
    { name, email, password }: RegisterData,
    helpers: FormikHelpers<RegisterData>,
  ) => {
    try {
      await doRegister({ name, email, password });
      navigate("/recommended", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
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
          Expand your mind, reading{" "}
          <span className={css.title_span}>a book</span>
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
            const showEyeToggle = !passError && !passSuccess;
            return (
              <Form className={css.form}>
              <div className={css.inputs}>
                <div className={css.field}>
                  <Field
                    id="name"
                    name="name"
                    placeholder=" "
                    className={`${css.input} ${css.inputName}`}
                  />
                  <label htmlFor="name" className={css.label}>
                    Name:
                  </label>
                  <ErrorMessage
                    name="name"
                    component="span"
                    className={css.error}
                  />
                </div>

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

                  {showEyeToggle && (
                    <button
                      type="button"
                      className={css.password_toggle}
                      onClick={() => setIsHashed((prev) => !prev)}
                    >
                      <Icon
                        name={isHashed ? "eye-off" : "eye"}
                        width={20}
                        height={20}
                      />
                    </button>
                  )}

                  <ErrorMessage
                    name="password"
                    component="span"
                    className={css.error}
                  />
                </div>
                </div>

                <div className={css.buttons}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={css.button}
                  >
                    Registration
                  </button>
                  <Link className={css.link} to="/login">
                    Already have an account?
                  </Link>
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
