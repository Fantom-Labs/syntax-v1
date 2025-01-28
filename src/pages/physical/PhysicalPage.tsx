import { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Save } from "lucide-react";
import { toast } from "sonner";

interface HealthData {
  age: number;
  height: number;
  weight: number;
  bloodType: string;
  allergies: string[];
  medications: string[];
}

export const PhysicalPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>(() => {
    const saved = localStorage.getItem("healthData");
    return saved ? JSON.parse(saved) : {
      age: 25,
      height: 170,
      weight: 70,
      bloodType: "O+",
      allergies: [],
      medications: [],
    };
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  useEffect(() => {
    localStorage.setItem("healthData", JSON.stringify(healthData));
  }, [healthData]);

  const calculateBMI = () => {
    const heightInMeters = healthData.height / 100;
    return (healthData.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = Number(calculateBMI());
    if (bmi < 18.5) return "Abaixo do peso";
    if (bmi < 25) return "Saudável";
    if (bmi < 30) return "Sobrepeso";
    return "Obesidade";
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setHealthData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setHealthData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication("");
    }
  };

  return (
    <PageTemplate title="Dados Físicos">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dados Básicos
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Idade</Label>
                <Input
                  type="number"
                  value={healthData.age}
                  disabled={!isEditing}
                  onChange={(e) => setHealthData(prev => ({ ...prev, age: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Altura (cm)</Label>
                <Input
                  type="number"
                  value={healthData.height}
                  disabled={!isEditing}
                  onChange={(e) => setHealthData(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  value={healthData.weight}
                  disabled={!isEditing}
                  onChange={(e) => setHealthData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo Sanguíneo</Label>
                <Input
                  value={healthData.bloodType}
                  disabled={!isEditing}
                  onChange={(e) => setHealthData(prev => ({ ...prev, bloodType: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">IMC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateBMI()}</div>
            <p className="text-xs text-muted-foreground">
              Categoria: {getBMICategory()}
            </p>
            <div className="mt-4 h-3 w-full rounded-full bg-secondary">
              <div
                className="h-3 rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (Number(calculateBMI()) / 40) * 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alergias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Nova alergia"
                />
                <Button onClick={addAllergy}>Adicionar</Button>
              </div>
              <ul className="space-y-2">
                {healthData.allergies.map((allergy, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{allergy}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHealthData(prev => ({
                        ...prev,
                        allergies: prev.allergies.filter((_, i) => i !== index)
                      }))}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Novo medicamento"
                />
                <Button onClick={addMedication}>Adicionar</Button>
              </div>
              <ul className="space-y-2">
                {healthData.medications.map((medication, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{medication}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHealthData(prev => ({
                        ...prev,
                        medications: prev.medications.filter((_, i) => i !== index)
                      }))}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};