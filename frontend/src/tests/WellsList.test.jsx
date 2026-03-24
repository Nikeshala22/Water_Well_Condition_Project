import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { test, expect, vi } from "vitest";
import WellsList from "../pages/WellsList";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

vi.mock("axios");

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "admin" },
  }),
}));

test("loads well data", async () => {
  axios.get.mockResolvedValue({
    data: {
      data: [
        {
          _id: "1",
          wellId: "W001",
          name: "Village Well",
          village: "Matara",
          status: "Active",
          type: "Tube Well",
          depth: 20,
        },
      ],
    },
  });

  render(
    <MemoryRouter>
      <WellsList />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Village Well")).toBeInTheDocument();
  });
});