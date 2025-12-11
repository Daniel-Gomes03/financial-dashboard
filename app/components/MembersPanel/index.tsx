"use client";

import { useFinancialDashboard } from '../../context/FinancialDashboardProvider';
import { FaUser, FaBirthdayCake, FaHeart } from 'react-icons/fa';
import { MdElderly } from "react-icons/md";
import MemberInfoItem from './MemberInfoItem';

export function MembersPanel() {
  const { simulation } = useFinancialDashboard();
  const members = simulation.active_income_members;
  
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Membros Ativos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-4 ">
        {members.map((member) => (
          <div key={member.uuid} className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
            <MemberInfoItem
              icon={<FaUser className="w-5 h-5 text-blue-500" />}
              label="Nome"
              value={member.name}
            />
            <MemberInfoItem
              icon={<FaBirthdayCake className="w-5 h-5 text-pink-500" />}
              label="Idade Atual"
              value={`${member.age} anos`}
            />
            <MemberInfoItem
              icon={<MdElderly className="w-6 h-6 text-green-500" />}
              label="Idade de Aposentadoria"
              value={`${member.retirement_age} anos`}
            />
            <MemberInfoItem
              icon={<FaHeart className="w-5 h-5 text-red-400" />}
              label="Expectativa de Vida"
              value={`${member.life_expectancy} anos`}
            />

          </div>
        ))}
      </div>
    </section>
  );
}

