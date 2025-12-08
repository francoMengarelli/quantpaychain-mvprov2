import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, PieChart, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

export default function EarningsTracker() {
  const [portfolio, setPortfolio] = useState(null);
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
    fetchDividends();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`${API_URL}/earnings/portfolio`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch portfolio');

      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('No se pudo cargar el portafolio');
    } finally {
      setLoading(false);
    }
  };

  const fetchDividends = async () => {
    try {
      const response = await fetch(`${API_URL}/earnings/dividends`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch dividends');

      const data = await response.json();
      setDividends(data);
    } catch (error) {
      console.error('Error fetching dividends:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando portafolio...</div>
      </div>
    );
  }

  const summary = portfolio?.summary || {};
  const holdings = portfolio?.holdings || [];

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white\">
      <div className=\"container mx-auto px-4 py-6 max-w-7xl\">
        {/* Header */}
        <div className=\"mb-6\">
          <h1 className=\"text-3xl md:text-4xl font-bold mb-2\">💰 Ganancias & ROI</h1>
          <p className=\"text-purple-200 text-sm md:text-base\">Seguimiento de rendimiento e inversiones</p>
        </div>

        {/* Summary Cards */}
        <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6\">
          <Card className=\"bg-white/10 backdrop-blur border-white/20\">
            <CardContent className=\"p-4 md:p-6\">
              <div className=\"flex items-center justify-between mb-2\">
                <span className=\"text-purple-200 text-xs md:text-sm\">Invertido Total</span>
                <DollarSign className=\"h-4 w-4 md:h-5 md:w-5 text-purple-300\" />
              </div>
              <p className=\"text-xl md:text-2xl font-bold\">${summary.total_invested?.toLocaleString() || '0'}</p>
            </CardContent>
          </Card>

          <Card className=\"bg-white/10 backdrop-blur border-white/20\">
            <CardContent className=\"p-4 md:p-6\">
              <div className=\"flex items-center justify-between mb-2\">
                <span className=\"text-purple-200 text-xs md:text-sm\">Valor Actual</span>
                <TrendingUp className=\"h-4 w-4 md:h-5 md:w-5 text-green-400\" />
              </div>
              <p className=\"text-xl md:text-2xl font-bold\">${summary.current_value?.toLocaleString() || '0'}</p>
            </CardContent>
          </Card>

          <Card className=\"bg-white/10 backdrop-blur border-white/20\">
            <CardContent className=\"p-4 md:p-6\">
              <div className=\"flex items-center justify-between mb-2\">
                <span className=\"text-purple-200 text-xs md:text-sm\">Dividendos</span>
                <PieChart className=\"h-4 w-4 md:h-5 md:w-5 text-blue-400\" />
              </div>
              <p className=\"text-xl md:text-2xl font-bold\">${summary.total_dividends?.toLocaleString() || '0'}</p>
            </CardContent>
          </Card>

          <Card className=\"bg-white/10 backdrop-blur border-white/20\">
            <CardContent className=\"p-4 md:p-6\">
              <div className=\"flex items-center justify-between mb-2\">
                <span className=\"text-purple-200 text-xs md:text-sm\">ROI</span>
                <Award className=\"h-4 w-4 md:h-5 md:w-5 text-yellow-400\" />
              </div>
              <div className=\"flex items-center gap-2\">
                <p className=\"text-xl md:text-2xl font-bold\">
                  {summary.roi_percentage >= 0 ? '+' : ''}{summary.roi_percentage?.toFixed(2) || '0'}%
                </p>
                {summary.roi_percentage >= 0 ? (
                  <ArrowUpRight className=\"h-4 w-4 md:h-5 md:w-5 text-green-400\" />
                ) : (
                  <ArrowDownRight className=\"h-4 w-4 md:h-5 md:w-5 text-red-400\" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <Card className=\"bg-white/10 backdrop-blur border-white/20 mb-6\">
          <CardHeader>
            <CardTitle className=\"text-white text-lg md:text-xl\">📊 Mis Inversiones</CardTitle>
          </CardHeader>
          <CardContent className=\"p-4\">
            {holdings.length === 0 ? (
              <p className=\"text-purple-200 text-center py-8 text-sm md:text-base\">
                No tienes inversiones aún. ¡Empieza a invertir en el marketplace!
              </p>
            ) : (
              <div className=\"space-y-4\">
                {holdings.map((item, idx) => (
                  <div
                    key={idx}
                    className=\"bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors\"
                  >
                    <div className=\"flex flex-col md:flex-row md:items-center md:justify-between gap-3\">
                      <div className=\"flex-1\">
                        <h3 className=\"font-semibold text-base md:text-lg mb-1\">{item.asset?.name || 'Asset'}</h3>
                        <div className=\"flex flex-wrap gap-2 text-xs md:text-sm text-purple-200\">
                          <span>Tokens: {item.holding?.quantity}</span>
                          <span>•</span>
                          <span>Invertido: ${item.holding?.total_invested?.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className=\"flex flex-col md:items-end gap-2\">
                        <Badge
                          variant={item.performance?.roi_percentage >= 0 ? 'default' : 'destructive'}
                          className=\"text-xs w-fit\"
                        >
                          ROI: {item.performance?.roi_percentage >= 0 ? '+' : ''}
                          {item.performance?.roi_percentage?.toFixed(2)}%
                        </Badge>

                        <div className=\"text-xs md:text-sm\">
                          <span className=\"text-purple-200\">Ganancia: </span>
                          <span className={`font-semibold ${item.performance?.total_gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${item.performance?.total_gain?.toLocaleString()}
                          </span>
                        </div>

                        <div className=\"text-xs md:text-sm\">
                          <span className=\"text-purple-200\">Dividendos: </span>
                          <span className=\"font-semibold text-blue-400\">
                            ${item.performance?.total_dividends?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dividend History */}
        <Card className=\"bg-white/10 backdrop-blur border-white/20\">
          <CardHeader>
            <CardTitle className=\"text-white text-lg md:text-xl\">💵 Historial de Dividendos</CardTitle>
          </CardHeader>
          <CardContent className=\"p-4\">
            {dividends.length === 0 ? (
              <p className=\"text-purple-200 text-center py-8 text-sm md:text-base\">
                No has recibido dividendos aún.
              </p>
            ) : (
              <div className=\"overflow-x-auto\">
                <table className=\"w-full text-sm\">
                  <thead className=\"border-b border-white/20\">
                    <tr className=\"text-left text-purple-200\">
                      <th className=\"pb-3\">Fecha</th>
                      <th className=\"pb-3\">Período</th>
                      <th className=\"pb-3\">Tokens</th>
                      <th className=\"pb-3 text-right\">Monto</th>
                      <th className=\"pb-3\">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividends.slice(0, 10).map((div, idx) => (
                      <tr key={idx} className=\"border-b border-white/10\">
                        <td className=\"py-3\">
                          {new Date(div.distribution_date).toLocaleDateString()}
                        </td>
                        <td className=\"py-3\">{div.period}</td>
                        <td className=\"py-3\">{div.tokens_held}</td>
                        <td className=\"py-3 text-right font-semibold text-green-400\">
                          ${div.amount.toLocaleString()}
                        </td>
                        <td className=\"py-3\">
                          <Badge variant={div.status === 'completed' ? 'default' : 'secondary'} className=\"text-xs\">
                            {div.status === 'completed' ? 'Pagado' : 'Pendiente'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
