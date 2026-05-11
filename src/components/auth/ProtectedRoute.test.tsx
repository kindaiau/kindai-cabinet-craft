import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import ProtectedRoute from "./ProtectedRoute";

const mockOnAuthStateChange = vi.fn();
const mockGetSession = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
      getSession: (...args: any[]) => mockGetSession(...args),
    },
  },
}));

vi.mock("@/contexts/TrialContext", () => ({
  TrialProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockOnAuthStateChange.mockReset();
    mockGetSession.mockReset();
  });

  it("renders a loading state while the session is resolving", () => {
    mockOnAuthStateChange.mockImplementation(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    }));
    mockGetSession.mockReturnValue(new Promise(() => {}));

    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/auth" element={<div>Auth Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to /auth", async () => {
    mockOnAuthStateChange.mockImplementation((callback) => {
      callback("SIGNED_OUT", null);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/auth" element={<div>Auth Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Auth Page")).toBeInTheDocument());
  });

  it("renders protected content when a session exists", async () => {
    const session = { user: { id: "123" } } as unknown as Session;

    mockOnAuthStateChange.mockImplementation((callback) => {
      callback("SIGNED_IN", session);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    mockGetSession.mockResolvedValue({ data: { session } });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/auth" element={<div>Auth Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Protected Content")).toBeInTheDocument());
  });
});
