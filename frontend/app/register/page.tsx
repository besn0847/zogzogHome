"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterForm>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const password = watch("password")

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Registration data:", data)
      setSuccess(true)
    } catch (err) {
      setError("Une erreur est survenue lors de la création du compte")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm text-center">
            <CardHeader className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center"
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Compte créé !</CardTitle>
                <CardDescription className="text-slate-600 mt-2">
                  Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] hover:from-[#1e3a8a] hover:to-[#059669] text-white font-medium">
                  Se connecter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-[#3b82f6] to-[#10b981] rounded-2xl flex items-center justify-center"
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Créer un compte</CardTitle>
              <CardDescription className="text-slate-600 mt-2">
                Rejoignez DocPDF Manager pour gérer vos documents
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    className={`transition-all duration-200 ${
                      errors.firstName
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-300 focus:border-[#3b82f6]"
                    }`}
                    {...register("firstName", {
                      required: "Le prénom est requis",
                      minLength: {
                        value: 2,
                        message: "Le prénom doit contenir au moins 2 caractères",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600"
                    >
                      {errors.firstName.message}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    className={`transition-all duration-200 ${
                      errors.lastName
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-300 focus:border-[#3b82f6]"
                    }`}
                    {...register("lastName", {
                      required: "Le nom est requis",
                      minLength: {
                        value: 2,
                        message: "Le nom doit contenir au moins 2 caractères",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600"
                    >
                      {errors.lastName.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className={`transition-all duration-200 ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-[#3b82f6]"
                  }`}
                  {...register("email", {
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format d'email invalide",
                    },
                  })}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pr-10 transition-all duration-200 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-300 focus:border-[#3b82f6]"
                    }`}
                    {...register("password", {
                      required: "Le mot de passe est requis",
                      minLength: {
                        value: 8,
                        message: "Le mot de passe doit contenir au moins 8 caractères",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pr-10 transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-300 focus:border-[#3b82f6]"
                    }`}
                    {...register("confirmPassword", {
                      required: "La confirmation du mot de passe est requise",
                      validate: (value) => value === password || "Les mots de passe ne correspondent pas",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  {...register("acceptTerms", {
                    required: "Vous devez accepter les conditions d'utilisation",
                  })}
                  className="data-[state=checked]:bg-[#3b82f6] data-[state=checked]:border-[#3b82f6] mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-[#3b82f6] hover:text-[#1e3a8a] underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" className="text-[#3b82f6] hover:text-[#1e3a8a] underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.acceptTerms.message}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] hover:from-[#1e3a8a] hover:to-[#059669] text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-[#3b82f6] hover:text-[#1e3a8a] font-medium transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
