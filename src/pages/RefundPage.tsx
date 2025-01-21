/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, X, Eye } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getKasus, getCategories, getJenisBarang, getStatus } from "../api/apiList";
import DateRangePicker from "../components/DateRangePicker";
import moment from "moment";

function CasesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null); 
  const [search, setSearch] = useState('');
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [casesItems, setcasesItems] = useState<any[]>([]);
  const [category, setcategory] = useState<any[]>([]);
  const [selectedCategory, setselectedCategory] = useState('');
  const [jenisBarang, setjenisBarang] = useState<any[]>([]);
  const [selectedJenisBarang, setselectedJenisBarang] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setstatus] = useState<any[]>([]);
  const [selectedStatus, setselectedStatus] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type CaseItem = any;

  useEffect(() => {
    loadCategories()
    loadJenisBarang()
    loadStatus()
  }, [])

  useEffect(() => {
    const formattedStartdate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    const formattedEnddate = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
    
    loadCases(search, selectedCategory, selectedJenisBarang, formattedStartdate, formattedEnddate, selectedStatus);
  },[search, selectedCategory, selectedJenisBarang, startDate, endDate, selectedStatus])

  const loadCases = async (search: string, category: string, jenis_barang: string, start_date: string, end_date: string, status: string) => {
    const params = {
      search,
      category,
      jenis_barang,
      status: status ? status : 'Refund,Completed',
      start_date: start_date || null,
      end_date: end_date || null,
      page: 1,
      limit: 10
    }
    const removeParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(params).filter(([key, value]) => value !== null)
    );  
    const response = await getKasus(removeParams);
    setcasesItems(response?.data?.data)
  }

  const loadCategories = async () => {
    const response = await getCategories();
    setcategory(response?.data)
  }

  const loadJenisBarang = async () => {
    const response = await getJenisBarang();
    setjenisBarang(response?.data)
  }

  const loadStatus = async () => {
    const params = {
      name: 'Refund,Completed'
    }
    const response = await getStatus(params);
    setstatus(response?.data)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-red-100 text-yellow-800';
      case 'Process':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refund':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Harap unggah file dengan format PDF.');
    }
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Mekanisme Pengembalian</h1>
        </div>

        {/* Search Bar */}
        <div className="gradient-card rounded-lg shadow-card p-4">
          <div className="relative flex items-center space-x-4 mb-2">
            <div className="relative">
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <div className="relative flex-1">
              <select
                className="py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                onChange={(e) => setselectedStatus(e.target.value)}
              >
                <option value="">SEMUA STATUS</option>
                {status.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <select
                className="py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                onChange={(e) => setselectedCategory(e.target.value)}
              >
                <option value="">SEMUA KATEGORI</option>
                {category.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <select
                className="py-2 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                onChange={(e) => setselectedJenisBarang(e.target.value)}
              >
                <option value="">SEMUA JENIS BARANG</option>
                {jenisBarang.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative flex items-center space-x-4">
            {/* Input Pencarian */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan deskripsi"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="gradient-card rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Tanggal Pengajuan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Jenis Barang</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Deskripsi</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {casesItems.map((item) => (
                  <tr key={item.cases_id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-2 text-xs font-medium text-slate-900">{formatDate(item.created_at)}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.category.toUpperCase()}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.jenis_barang.toUpperCase()}</td>
                    <td className="px-6 py-2 text-xs text-slate-600">{item.description.toUpperCase()}</td>
                    <td className="px-6 py-2 text-center">
                      <button
                        onClick={() => setSelectedCase(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {
                  casesItems.length === 0 &&
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

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="gradient-card rounded-xl shadow-lg w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Detail Pengembalian</h2>
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Informasi Kasus */}
                  <div className="gradient-card rounded-lg shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID Kasus</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Tanggal Pengajuan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">NIP</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Nama</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Jabatan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Hp</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Kategori</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Jenis Barang</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Deskripsi</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Nilai Kerugian</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.cases_id}</td>
                            <td className="px-6 py-2 text-xs font-medium text-slate-900">{formatDate(selectedCase.created_at)}</td>
                            <td className="px-6 py-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedCase.status)}`}>
                                {selectedCase.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.nip}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.name.toUpperCase()}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.jabatan.toUpperCase()}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.hp}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.category.toUpperCase()}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.jenis_barang.toUpperCase()}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.description.toUpperCase()}</td>
                            <td className="px-6 py-2 text-xs text-slate-600">{selectedCase.amount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <label className="text-lg font-bold">Total Pengembalian : Rp. 10000,-</label>
                    {selectedCase.status === 'refund' && 
                      <button
                        onClick={() => setShowAddForm(true)}
                        type="submit"
                        className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity bg-green-600 flex"
                      >
                        Tambah Bukti Pengembalian
                      </button>
                    }
                  </div>

                  {/* Informasi Pengembalian */}
                  <div className="gradient-card rounded-lg shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Tanggal Pengembalian</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Jumlah Pengembalian</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Bukti Pengembalian</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td colSpan={3} className="text-center px-6 py-2 text-xs text-slate-600">
                              <span>Tidak Ada Data</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Case Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="gradient-card rounded-xl shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Tambah Bukti Pengembalian</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tanggal Pengembalian
                    </label>
                    <DatePicker
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Pilih tanggal pengembalian"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Jumlah Pengembalian
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan Jumlah Pengembalian"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unggah Bukti Pengembalian (PDF)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {pdfFile && (
                      <p className="mt-2 text-xs text-slate-400">
                        File: {pdfFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="gradient-primary px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CasesPage;