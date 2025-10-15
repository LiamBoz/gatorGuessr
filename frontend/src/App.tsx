import React from 'react';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
		<BrowserRouter>
				<Routes>
						<Route path="/" element={<Landing />} />
				</Routes>
		</BrowserRouter>
  );
}
