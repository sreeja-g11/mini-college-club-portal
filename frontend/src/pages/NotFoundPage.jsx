import { Link } from "react-router-dom";
import { EmptyState } from "../components/Feedback";

export default function NotFoundPage() {
  return (
    <EmptyState title="This page isn't on the board" text="The link may be old or mistyped.">
      <Link to="/" className="btn btn-primary">
        Back to dashboard
      </Link>
    </EmptyState>
  );
}
