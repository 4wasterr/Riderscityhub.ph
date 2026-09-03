import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import "./forgotPassword.css";

function ForgotPassword({ onBackToLogin }) {
	const [error, setError] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	function handleSubmit(event) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const values = [
			form.get("email"),
			form.get("otp"),
			form.get("newPassword"),
			form.get("confirmPassword"),
		].map((value) => String(value || "").trim());

		if (values.some((value) => !value)) {
			setError("Please complete all fields.");
			return;
		}

		if (values[2] !== values[3]) {
			setError("Passwords do not match.");
			return;
		}

		setError("");
	}

	return (
		<main className="forgot-page">
			<section className="forgot-card" aria-labelledby="forgot-title">
				<div className="forgot-content">
					<h1 id="forgot-title">Riderscityhub.ph POS</h1>
					<p className="forgot-subtitle">Forgot your password?</p>

					<form className="forgot-form" onSubmit={handleSubmit} noValidate>
						<label htmlFor="forgot-email">E-Mail</label>
						<input id="forgot-email" name="email" type="email" autoComplete="email" />

						<label htmlFor="forgot-otp">Enter OTP</label>
						<input id="forgot-otp" name="otp" type="text" inputMode="numeric" />

						<label htmlFor="new-password">Enter New Password</label>
						<span className="forgot-password-wrap">
							<input
								id="new-password"
								name="newPassword"
								type={showNewPassword ? "text" : "password"}
								autoComplete="new-password"
							/>
							<button
								type="button"
								className="forgot-toggle-password"
								onClick={() => setShowNewPassword((value) => !value)}
								aria-label={showNewPassword ? "Hide new password" : "Show new password"}
								aria-pressed={showNewPassword}
							>
								{showNewPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
							</button>
						</span>

						<label htmlFor="confirm-password">Confirm New Password</label>
						<span className="forgot-password-wrap">
							<input
								id="confirm-password"
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								autoComplete="new-password"
							/>
							<button
								type="button"
								className="forgot-toggle-password"
								onClick={() => setShowConfirmPassword((value) => !value)}
								aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
								aria-pressed={showConfirmPassword}
							>
								{showConfirmPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
							</button>
						</span>

						{error ? <p className="forgot-error" role="alert">{error}</p> : null}

						<button type="submit" className="forgot-submit">Finish</button>
					</form>

					<p className="forgot-return">
						Remember your password?{" "}
						<button type="button" onClick={onBackToLogin}>Sign In</button>
					</p>
				</div>
			</section>
		</main>
	);
}

export default ForgotPassword;
