/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getLogHasil } from '../api/apiList';
import { Search, X } from 'lucide-react';
import DateRangePicker from "../components/DateRangePicker";
import moment from 'moment';

function LogDataComparePage() {
	const [search, setSearch] = useState('');
	const [LogHasil, setLogHasil] = useState<any[]>([]);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	useEffect(() => {
		const formattedStartdate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
		const formattedEnddate = endDate ? moment(endDate).format("YYYY-MM-DD") : "";

		loadLogHasil(search, formattedStartdate, formattedEnddate);
	}, [search, startDate, endDate])

	const loadLogHasil = async (search: string, start_date: string, end_date: string) => {
		const params = {
      nama_rekening: search, 
			startdate: start_date, 
			enddate: end_date
    }
    const removeParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(params).filter(([key, value]) => value !== null)
    );  
		const response = await getLogHasil(removeParams);
		setLogHasil(response?.data)
	}

	const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

	return (
		<Layout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-slate-900">Log Data Compare</h1>
				</div>

				{/* Table */}
				<div className="gradient-card rounded-lg shadow-card overflow-hidden">
					<div className="relative flex mx-2 mt-2">
						<div className="relative flex-1 mr-2">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Cari berdasarkan nama rekening"
								className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							{search && (
								<button
									onClick={() => setSearch('')}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
								>
									<X className="w-5 h-5" />
								</button>
							)}
						</div>
						<div className="relative">
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
					</div>
					<div className="overflow-x-auto h-[70vh]">
						<table className="w-full">
							<thead>
								<tr className="border-b border-slate-200">
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Tanggal STBP</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Nomor STBP</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Kode SKPD</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Unit SKPD</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Keterangan</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Kode Rekening</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Nama Rekening</th>
										<th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Niai</th>
								</tr>
							</thead>
							<tbody>
								{LogHasil.map((item) => (
									<tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
										<td className="px-6 py-2 text-xs text-slate-600">{item.tanggal_stbp}</td>
										<td className="px-6 py-2 text-xs text-slate-600">{item.nomor_stbp}</td>
										<td className="px-6 py-2 text-xs text-slate-600">{item.kode_skpd}</td>
										<td className="px-6 py-2 text-xs text-slate-600">{item.unit_skpd}</td>
										<td className="px-6 py-2 text-xs text-slate-600">{item.keterangan}</td>
										<td className="px-6 py-2 text-xs text-slate-600">{item.kode_rekening}</td>
										<td className="px-6 py-2 text-xs text-slate-600">{item.nama_rekening}</td>
										<td className="px-6 py-2 text-xs text-slate-600">
											{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.nilai)}
										</td>
									</tr>
								))}
								{
									LogHasil.length === 0 &&
									<tr className="border-b border-slate-100 hover:bg-slate-50/50">
										<td colSpan={8} className="text-center px-6 py-2 text-xs text-slate-600">
											<span>Tidak Ada Data</span>
										</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default LogDataComparePage;