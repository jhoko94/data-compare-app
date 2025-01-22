/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getReferensi, postHasil, getTempHasil, DelTempHasil, DelAllTempHasil, postLogHasil } from '../api/apiList';
import { Plus, Search, X, Trash, Download } from 'lucide-react';
import Papa from 'papaparse'; // Import the PapaParse library
import moment from 'moment';

function DataComparePage() {
  const [Refensi, setRefensi] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]); // Store parsed CSV data
  const [Input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [itemSearch, setitemSearch] = useState({d: null, g: null, j: null});
  const [tempHasil, setTempHasil] = useState<any[]>([]);

  useEffect(() => {
    // const input = ''
    loadReferensi(Input, search)
  }, [Input, search])

  useEffect(() => {
    handleDelAllTempHasil();
    loadTempHasil();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const loadTempHasil = async () => {
    const response = await getTempHasil();
    setTempHasil(response?.data)
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
      const data = {
        tanggal_stbp: itemSearch.d,
        kode_skpd: item.kode_odp,
        unit_skpd: item.nama_odp,
        keterangan: itemSearch.g,
        kode_rekening: item.kode_akun,
        nama_rekening: item.nama_akun,
        nilai: itemSearch.j
      };

      await postHasil(data);
      loadTempHasil()
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleSearch = (item: any) => {
    setInput(item.g)
    const pisahin = item.d.split("/")
    const day = pisahin[0]
    const month = pisahin[1]
    const year = pisahin[2]
    const dateItem = item && moment(`${year}-${month}-${day}`).format('YYYY-MM-DD')
    setitemSearch({
      d: dateItem,
      g: item.g,
      j: item.j
    })
  }

  const handleDelTempHasil = async (kode: string) => {
    await DelTempHasil(kode);
    loadTempHasil()
  }

  const handleDelAllTempHasil = async () => {
    await DelAllTempHasil();
    loadTempHasil();
  }

  const handleAddLogHasil = async () => {
    try {
      await postLogHasil(tempHasil);
      handleDelAllTempHasil()
    } catch (error) {
        console.error('Error:', error);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Data Compare</h1>
        </div>

        {/* CSV Upload Section */}
        <div className="gradient-card rounded-lg shadow-card p-2">
          <h3 className="text-1xl font-bold text-slate-900">Upload CSV</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mt-2 p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Tabel Upload */}
        {csvData.length > 0 &&
        <div className="gradient-card rounded-lg shadow-card pt-2">
          <h3 className="text-1xl font-bold text-slate-900 ml-2">Tabel Upload</h3>
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
                      <td className="px-6 py-2 text-xs text-slate-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.j)}
                      </td>
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
        }

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
                        disabled={csvData.length === 0}
                        className={`font-medium text-xs ${
                          csvData.length === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
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

        {/* Compare Table */}
        {csvData.length > 0 && 
          <div className="gradient-card rounded-lg shadow-card overflow-hidden">
            <div className="flex">
              <h3 className="text-1xl font-bold text-slate-900 ml-2 mt-2">Tabel Hasil Penggabungan</h3>
              <div className="relative flex flex-1 mx-2 mt-2 justify-end">
                <button
                  onClick={handleAddLogHasil}
                  disabled={tempHasil.length === 0}
                  className={`px-4 py-2 rounded-lg text-white font-medium flex items-center transition-opacity mr-2 ${
                    tempHasil.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "gradient-primary hover:opacity-90"
                  }`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Simpan
                </button>
                <button
                  onClick={handleDelAllTempHasil}
                  disabled={tempHasil.length === 0}
                  className={`px-4 py-2 rounded-lg text-white font-medium flex items-center transition-opacity mr-2 ${
                    tempHasil.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "gradient-red hover:opacity-90"
                  }`}
                >
                  <Trash className="w-5 h-5 mr-2" />
                  Bersihkan
                </button>
              </div>
            </div>
            <div className="overflow-x-auto h-[25vh]">
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
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tempHasil.map((item) => (
                    <tr key={item.kode_rekening} className="border-b border-slate-100 hover:bg-slate-50/50">
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
                      <td className="px-6 py-2 text-center">
                        <button
                          onClick={() => handleDelTempHasil(item.kode_rekening)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {
                    tempHasil.length === 0 &&
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td colSpan={9} className="text-center px-6 py-2 text-xs text-slate-600">
                        <span>Tidak Ada Data</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </Layout>
  );
}

export default DataComparePage;