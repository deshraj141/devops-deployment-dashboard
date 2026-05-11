import { Link } from "react-router-dom";

const AuthCard = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/65 p-8 shadow-glass backdrop-blur-xl">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300/90">
        DevOps Deployment Monitoring Dashboard
      </p>
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-100/90">{subtitle}</p>

      <div className="mt-6">{children}</div>

      <p className="mt-6 text-sm text-slate-100/90">
        {footerText}{" "}
        <Link
          to={footerLink}
          className="font-semibold text-cyan-100 underline underline-offset-2"
        >
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthCard;
