import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function LeaderboardScreen() {
  const { leaderboard, teams } = useAppData();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Get unique sports
  const sports = useMemo(() => {
    const uniqueSports = Array.from(new Set(leaderboard.map(entry => entry.sport)));
    return ['all', ...uniqueSports];
  }, [leaderboard]);

  // Filter leaderboard
  const filteredLeaderboard = useMemo(() => {
    let filtered = [...leaderboard];
    
    if (selectedSport !== 'all') {
      filtered = filtered.filter(entry => entry.sport === selectedSport);
    }
    
    if (selectedTeam !== 'all') {
      filtered = filtered.filter(entry => entry.teamId === selectedTeam);
    }

    // Sort by points (or primary stat)
    filtered.sort((a, b) => {
      const aPoints = a.stats.points || a.stats.goals || 0;
      const bPoints = b.stats.points || b.stats.goals || 0;
      return bPoints - aPoints;
    });

    return filtered;
  }, [leaderboard, selectedSport, selectedTeam]);

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-600';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(255,255,255)]">
      {/* Header */}
      <div className="bg-black text-white p-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={32} />
            <h1 className="text-2xl font-bold">Ranking</h1>
          </div>
          <p className="text-gray-300">
            Acompanhe o desempenho dos atletas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Modalidade</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors"
            >
              <option value="all">Todas</option>
              {sports.filter(s => s !== 'all').map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Turma</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors"
            >
              <option value="all">Todas</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-2xl mx-auto p-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-2">
            {filteredLeaderboard.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Nenhum atleta encontrado</p>
              </div>
            ) : (
              filteredLeaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Position */}
                  <div className="flex items-center justify-center w-10">
                    {index < 3 ? (
                      <Medal size={24} className={getMedalColor(index + 1)} />
                    ) : (
                      <span className="font-bold text-gray-400">#{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={entry.athleteAvatar} />
                    <AvatarFallback>{entry.athleteName[0]}</AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold">{entry.athleteName}</p>
                    <p className="text-sm text-gray-600">{entry.sport}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {entry.stats.points || entry.stats.goals || 0}
                    </p>
                    <p className="text-xs text-gray-500">pontos</p>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-2">
            {filteredLeaderboard.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Nenhuma estatística disponível</p>
              </div>
            ) : (
              filteredLeaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Position */}
                  <div className="flex items-center justify-center w-10">
                    {index < 3 ? (
                      <Medal size={24} className={getMedalColor(index + 1)} />
                    ) : (
                      <span className="font-bold text-gray-400">#{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={entry.athleteAvatar} />
                    <AvatarFallback>{entry.athleteName[0]}</AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold">{entry.athleteName}</p>
                    <p className="text-sm text-gray-600">{entry.sport}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(entry.stats).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                        <p className="text-xs text-gray-600 capitalize mb-0.5">
                          {key === 'goals' ? 'Gols' :
                           key === 'assists' ? 'Assist.' :
                           key === 'attendance' ? 'Presença' :
                           key === 'points' ? 'Pontos' :
                           key === 'wins' ? 'Vitórias' : key}
                        </p>
                        <p className="text-sm font-bold">
                          {value}{key === 'attendance' && '%'}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}