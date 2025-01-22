/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getReferensi, postHasil } from '../api/apiList';
import { Plus, Search, X } from 'lucide-react';
import Papa from 'papaparse'; // Import the PapaParse library
import moment from 'moment';

function DataComparePage() {
  const [Refensi, setRefensi] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]); // Store parsed CSV data
  const [Input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [itemSearch, setitemSearch] = useState({d: null, g: null, j: null});

  useEffect(() => {
    // const input = ''
    loadReferensi(Input, search)
  }, [Input, search])

  useEffect(() => {
    console.log('tes csvData:', csvData)
  }, [csvData])

  const loadReferensi = async (input: string, searchNamaAkun: string) => {
    const params = {
      input,
      searchNamaAkun
    }
    const removeParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(params).filter(([key, value]) => value !== null)
    );  
    const response = await getReferensi(removeParams);
    setRefensi(response?.data)
  }

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data); // Store parsed data
        },
        header: true, // Assuming the first row is the header
      });
    }
  }
  
  const handleAddHasil = async (item: any) => {
    try {
      console.log('tes item:', item)
      console.log('tes itemSearch:', itemSearch)
      const data = {
        tanggal_stbp: itemSearch.d,
        kode_skpd: item.kode_odp,
        unit_skpd: item.nama_odp,
        keterangan: itemSearch.g,
        kode_rekening: item.kode_akun,
        nama_rekening: item.nama_akun,
        nilai: itemSearch.j
      };

      const response = await postHasil(data);
      console.log('Success:', response);
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleSearch = (item: any) => {
    setInput(item.g)
    const dateItem = item && moment(item.d).format('YYYY-MM-DD')
    setitemSearch({
      d: dateItem,
      g: item.g,
      j: item.j
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Data Compare</h1>
        </div>

        {/* CSV Upload Section */}
        <div className="gradient-card rounded-lg shadow-card p-4">
          <h3 className="text-1xl font-bold text-slate-900 ml-2 mt-2">Upload CSV</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-2 p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Tabel Upload */}
        <div className="gradient-card rounded-lg shadow-card p-4">
          <h3 className="text-1xl font-bold text-slate-900 ml-2 mt-2">Tabel Upload</h3>
          <div className="overflow-x-auto h-[25vh]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">d</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">g</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">j</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {csvData.length > 0 ? (
                  csvData.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-6 py-2 text-xs text-slate-600">{(item.d)}</td>
                      <td className="px-6 py-2 text-xs text-slate-600">{item.g}</td>
                      <td className="px-6 py-2 text-xs text-slate-600">{item.j}</td>
                      <td className="px-6 py-2 text-center">
                        <button
                          onClick={() => handleSearch(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td colSpan={6} className="text-center px-6 py-2 text-xs text-slate-600">
                      <span>Tidak Ada Data</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referensi Table */}
        <div className="gradient-card rounded-lg shadow-card overflow-hidden">
          <h3 className="text-1xl font-bold text-slate-900 ml-2 mt-2">Tabel Referensi</h3>
          <div className="relative flex-1 ml-2 mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari"
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
          <div className="overflow-x-auto h-[25vh]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Tahun</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Kode Akun</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Nama Akun</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Kode Odp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Nama Odp</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Refensi.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-2 text-xs text-slate-600">{item.tahun}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.kode_akun}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.nama_akun.toUpperCase()}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.kode_odp}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.nama_odp.toUpperCase()}</td>
                    <td className="px-6 py-2 text-center">
                      <button
                        onClick={() => handleAddHasil(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {
                  Refensi.length === 0 &&
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td colSpan={6} className="text-center px-6 py-2 text-xs text-slate-600">
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

export default DataComparePage;