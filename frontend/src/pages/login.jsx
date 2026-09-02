import "./login.css";

function Login() {
	return (
		<main className="login-page">
			<section className="login-panel" aria-labelledby="login-title">
				<div className="login-brand">
					<span className="brand-mark">RC</span>
					<span>Riders City Hub</span>
				</div>

				<div className="login-heading">
					<p className="eyebrow">Operations portal</p>
					<h1 id="login-title">Welcome back</h1>
					<p>Sign in to manage your city hub.</p>
				</div>

				<form className="login-form">
					<label htmlFor="email">Email address</label>
					<input id="email" name="email" type="email" placeholder="you@riderscityhub.ph" required />

					<div className="password-label">
						<label htmlFor="password">Password</label>
						<button type="button" className="forgot-button">Forgot password?</button>
					</div>
					<input id="password" name="password" type="password" placeholder="Enter your password" required />

					<label className="remember-option">
						<input type="checkbox" name="remember" />
						<span>Keep me signed in</span>
					</label>

					<button type="submit" className="submit-button">Sign in</button>
				</form>

				<p className="login-footer">Need access? Contact your hub administrator.</p>
			</section>
		</main>
	);
}

export default Login;
